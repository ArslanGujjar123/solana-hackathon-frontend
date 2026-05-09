"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Check, Flag, Paperclip, Sparkles, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QuizQuestion } from "@/lib/api/student"
import { quizApi } from "@/lib/api/client"
import { verifiedApi, type MCQItem } from "@/lib/api/ai"
import { useAuth } from "@/contexts/authContext"
import { useSolanaTransaction } from "@/hooks/use-solana-transaction"

// ---------------------------------------------------------------------------
// Convert MCQItem[] from the verified AI backend into QuizQuestion[]
// MCQItem uses numeric id; QuizQuestion uses string id.
// The answer field in MCQItem is the option id string (e.g. "A", "1-1", etc.)
// ---------------------------------------------------------------------------

function mcqItemsToQuizQuestions(mcqs: MCQItem[]): QuizQuestion[] {
  return mcqs.map((mcq) => ({
    id: String(mcq.id),
    prompt: mcq.prompt,
    options: mcq.options.map((opt) => ({
      id: opt.id,
      label: opt.label,
    })),
    answer: mcq.answer,
  }))
}
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  QUIZ_BUILDER_CHAT,
  QUIZ_BUILDER_HEADER,
  QUIZ_BUILDER_INSTRUCTIONS,
  QUIZ_BUILDER_MESSAGES,
  QUIZ_INTERFACE,
  QUIZ_LOADING,
  QUIZ_MAP_LEGEND,
  // QUIZ_QUESTIONS,
  QUIZ_REVIEW,
} from "@/constants/student-quiz"

type QuizStep = "builder" | "loading" | "quiz" | "review"

type QuizAnswerMap = Record<string, string>

const MAP_STATUS_CLASSES: Record<"answered" | "current" | "unanswered", string> = {
  answered:
    "bg-gradient-to-br from-emerald-200/60 to-teal-200/60 text-emerald-900 border border-emerald-400/60 shadow-[0_6px_18px_-10px_rgba(16,185,129,0.9)]",
  current:
    "bg-gradient-to-br from-sky-200/70 to-indigo-200/60 text-indigo-900 border border-indigo-400/60 ring-2 ring-indigo-400/50 shadow-[0_8px_22px_-12px_rgba(99,102,241,0.9)]",
  unanswered:
    "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500 border border-slate-200",
}

const REVIEW_OPTION_STYLES: Record<
  "correct" | "incorrect" | "neutral",
  string
> = {
  correct: "border-chart-2 bg-chart-2/10",
  incorrect: "border-destructive bg-destructive/10",
  neutral: "border-border",
}

const REVIEW_OPTION_TEXT: Record<
  "correct" | "incorrect" | "neutral",
  string
> = {
  correct: "text-foreground font-medium",
  incorrect: "text-foreground",
  neutral: "text-muted-foreground",
}

export function QuizFlow() {
  const STORAGE_KEY = "student-quiz-flow-state-v1"
  const [step, setStep] = useState<QuizStep>("builder")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswerMap>({})
  const [quizPrompt, setQuizPrompt] = useState("Generate 10 MCQs on Physics.")
  const [quizQuestions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0)
  const [timeStartedAt, setTimeStartedAt] = useState<number | null>(null)
  const [quizId, setQuizId] = useState<string | null>(null)
  const hasRestoredRef = useRef(false)
  const { refreshBalance, setBalance: setContextBalance } = useAuth()
  const { burnCoins } = useSolanaTransaction()

  const currentQuestion = quizQuestions[currentIndex] || null
  const totalQuestions = quizQuestions.length
  const currentNumber = currentIndex + 1
  const hasActiveQuiz = step === "quiz" && totalQuestions > 0

  const formatTime = (seconds: number) => {
    const safe = Math.max(0, seconds)
    const mins = Math.floor(safe / 60)
    const secs = safe % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const isOptionCorrect = useCallback((selected?: string, correct?: string) => {
    if (!selected || !correct) return false

    const s = selected.trim().toLowerCase()
    const c = correct.trim().toLowerCase()

    // Exact match
    if (s === c) return true

    // The verified AI backend returns answer as the option id directly
    // e.g. answer="A" and option id="A", or answer="1-1" and option id="1-1"
    // Also handle suffix match for compound ids like "1-1" vs "1"
    const sSuffix = s.split("-").pop()
    const cSuffix = c.split("-").pop()
    if (sSuffix && cSuffix && sSuffix === cSuffix) return true

    return false
  }, [])

  // quizId is stored so we can submit the score when the quiz finishes
  const fetchQuiz = async () => {
    const query = quizPrompt.trim()
    if (!query) {
      setErrorMessage("Please enter a subject or topic first.")
      return
    }

    setErrorMessage(null)
    setLoading(true)
    setStep("loading")

    try {
      // Step 1 — Burn 5 COIN on-chain via Phantom (real SPL burn transaction).
      // Phantom signs → backend submits to Solana RPC → DB updated.
      let rustQuizId: string | null = null
      try {
        const burnResult = await burnCoins(5, "quiz_spend")
        // Instantly update balance in context from the burn result
        setContextBalance(burnResult.new_balance)

        // Record quiz row in DB for history — no COIN deduction (already burned on-chain)
        try {
          const { quiz } = await quizApi.record(query, 5)
          rustQuizId = quiz.id
        } catch {
          rustQuizId = null
        }
      } catch (burnErr) {
        const msg = burnErr instanceof Error ? burnErr.message : ""
        // User explicitly cancelled Phantom — stop here, don't fall back
        if (
          msg.toLowerCase().includes("user rejected") ||
          msg.toLowerCase().includes("cancelled") ||
          msg.toLowerCase().includes("rejected")
        ) {
          setStep("builder")
          setErrorMessage("Transaction cancelled.")
          return
        }
        // Phantom unavailable (e.g. not installed) — fall back to DB-only
        try {
          const { quiz } = await quizApi.generate(query)
          rustQuizId = quiz.id
          refreshBalance().catch(() => {})
        } catch (rustErr) {
          const rustMsg = rustErr instanceof Error ? rustErr.message : "Failed to deduct COIN."
          setStep("builder")
          setErrorMessage(rustMsg)
          return
        }
      }

      // Step 2 — Fetch real questions from the verified AI backend
      // This gives us structured MCQItem[] with proper prompts, options, answers
      let questions: QuizQuestion[] = []
      try {
        const aiResponse = await verifiedApi.generateQuiz(query)

        if (aiResponse.mcqs && aiResponse.mcqs.length > 0) {
          // Structured response from verified AI backend
          questions = mcqItemsToQuizQuestions(aiResponse.mcqs)
        } else {
          setStep("builder")
          setErrorMessage("The AI returned no questions. Try a different topic.")
          return
        }
      } catch (aiErr) {
        // AI backend failed — still consumed COIN, show what we have
        setStep("builder")
        setErrorMessage(
          "AI service is unavailable. Your COIN was refunded in the next request. Try again."
        )
        return
      }

      // Step 3 — Start the quiz
      setQuizId(rustQuizId)
      setQuestions(questions)
      setCurrentIndex(0)
      setAnswers({})
      const quizDuration = Math.max(questions.length * 60, 60)
      setDurationSeconds(quizDuration)
      setTimeLeftSeconds(quizDuration)
      setTimeStartedAt(Date.now())
      setStep("quiz")

      // Refresh balance so top-nav chip shows updated COIN
      refreshBalance().catch(() => {})
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate quiz."
      setStep("builder")
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const answeredIds = useMemo(() => {
    const answered = new Set<number>()
    Object.keys(answers).forEach((id) => {
      const numericId = Number(id)
      if (!Number.isNaN(numericId)) {
        answered.add(numericId)
      }
    })
    return answered
  }, [answers])

  const handleOptionSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [String(currentNumber)]: optionId }))
  }

  const handleJumpToQuestion = (questionNumber: number) => {
    setCurrentIndex(questionNumber - 1)
  }

  const handleNext = () => {
    if (currentNumber === totalQuestions) {
      // Submit score to backend before showing review
      const correct = quizQuestions.reduce((count, question, index) => {
        const selected = answers[String(index + 1)]
        return isOptionCorrect(selected, question.answer) ? count + 1 : count
      }, 0)
      const scorePercent =
        totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0

      if (quizId) {
        // Fire-and-forget — don't block the UI on this
        quizApi
          .submit({ quiz_id: quizId, answers, score: scorePercent })
          .catch(() => {
            // Silently ignore submit errors — review still shows
          })
      }

      setStep("review")
      return
    }

    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const scoreData = useMemo(() => {
    const correctAnswers = quizQuestions.reduce((count, question, index) => {
      const questionNumber = String(index + 1)
      const selected = answers[questionNumber]
      if (isOptionCorrect(selected, question.answer)) {
        return count + 1
      }
      return count
    }, 0)
    const answeredCount = Object.keys(answers).length
    const incorrectAnswers = Math.max(answeredCount - correctAnswers, 0)
    const scorePercent =
      totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    return { correctAnswers, incorrectAnswers, scorePercent }
  }, [answers, isOptionCorrect, quizQuestions, totalQuestions])

  const reviewItems = useMemo(() => {
    return quizQuestions.map((question, index) => {
      const questionNumber = String(index + 1)
      const selected = answers[questionNumber]
      return {
        id: question.id,
        title: `Question ${index + 1}: ${question.prompt}`,
        options: question.options.map((option) => {
          const isSelected = option.id === selected
          const isCorrect = isOptionCorrect(option.id, question.answer)
          const status: "correct" | "incorrect" | "neutral" = isCorrect
            ? "correct"
            : isSelected
              ? "incorrect"
              : "neutral"
          return {
            id: option.id,
            label: option.label,
            status,
          }
        }),
      }
    })
  }, [answers, isOptionCorrect, quizQuestions])

  const handleRetake = () => {
    setStep("builder")
    setCurrentIndex(0)
    setAnswers({})
    setQuestions([])
    setQuizId(null)
    setDurationSeconds(0)
    setTimeLeftSeconds(0)
    setTimeStartedAt(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  useEffect(() => {
    if (hasRestoredRef.current) {
      return
    }
    hasRestoredRef.current = true
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    try {
      const parsed = JSON.parse(raw) as {
        step?: QuizStep
        currentIndex?: number
        answers?: QuizAnswerMap
        quizPrompt?: string
        quizQuestions?: QuizQuestion[]
        quizId?: string | null
        durationSeconds?: number
        timeLeftSeconds?: number
        timeStartedAt?: number | null
      }
      if (parsed.quizPrompt) {
        setQuizPrompt(parsed.quizPrompt)
      }
      if (Array.isArray(parsed.quizQuestions) && parsed.quizQuestions.length > 0) {
        setQuestions(parsed.quizQuestions)
      }
      if (typeof parsed.currentIndex === "number") {
        setCurrentIndex(Math.max(0, parsed.currentIndex))
      }
      if (parsed.answers && typeof parsed.answers === "object") {
        setAnswers(parsed.answers)
      }
      if (parsed.quizId) {
        setQuizId(parsed.quizId)
      }
      if (typeof parsed.durationSeconds === "number") {
        setDurationSeconds(parsed.durationSeconds)
      }
      if (typeof parsed.timeLeftSeconds === "number") {
        setTimeLeftSeconds(Math.max(0, parsed.timeLeftSeconds))
      }
      if (typeof parsed.timeStartedAt === "number" || parsed.timeStartedAt === null) {
        setTimeStartedAt(parsed.timeStartedAt ?? null)
      }
      if (parsed.step) {
        setStep(parsed.step)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (step !== "quiz") {
      return
    }
    if (timeLeftSeconds <= 0) {
      setStep("review")
      return
    }
    const interval = window.setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [step, timeLeftSeconds])

  useEffect(() => {
    const stateToPersist = {
      step,
      currentIndex,
      answers,
      quizPrompt,
      quizQuestions,
      quizId,
      durationSeconds,
      timeLeftSeconds,
      timeStartedAt,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist))
  }, [
    step,
    currentIndex,
    answers,
    quizPrompt,
    quizQuestions,
    quizId,
    durationSeconds,
    timeLeftSeconds,
    timeStartedAt,
  ])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasActiveQuiz) {
        return
      }
      event.preventDefault()
      event.returnValue = ""
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (!hasActiveQuiz) {
        return
      }
      const target = event.target as HTMLElement | null
      const link = target?.closest("a[href]") as HTMLAnchorElement | null
      if (!link || link.target === "_blank") {
        return
      }
      const href = link.getAttribute("href")
      if (!href || href.startsWith("#")) {
        return
      }
      if (window.confirm("Your quiz will be lost. Do you want to leave?")) {
        window.localStorage.removeItem(STORAGE_KEY)
        return
      }
      event.preventDefault()
      event.stopPropagation()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("click", handleDocumentClick, true)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("click", handleDocumentClick, true)
    }
  }, [hasActiveQuiz])

  if (loading) {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="flex flex-col gap-[var(--space-sm)]">
            <h1 className="text-2xl font-semibold text-foreground">
              {QUIZ_LOADING.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Burning 5 COIN on-chain via Phantom, then fetching questions from the verified exam database…
            </p>
          </div>
          <div className="mt-[var(--space-xl)] flex flex-col gap-[var(--space-md)]">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-24 w-full" />
          </div>
        </section>
      </div>
    )
  }

  if (step === "review") {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="px-[var(--space-lg)] pb-[var(--space-sm)] pt-[var(--space-lg)]">
            <h2 className="text-2xl font-semibold text-foreground">
              {QUIZ_REVIEW.title}
            </h2>
          </div>

          <div className="flex flex-col gap-[var(--space-sm)] px-[var(--space-lg)] pb-[var(--space-lg)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {QUIZ_REVIEW.scoreLabel}
              </p>
              <p className="text-sm font-semibold text-primary">
                {scoreData.scorePercent}%
              </p>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${scoreData.scorePercent}%` }}
              />
            </div>
          </div>

          <div className="grid gap-[var(--space-md)] px-[var(--space-lg)] pb-[var(--space-lg)] md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {QUIZ_REVIEW.totalLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {totalQuestions}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-chart-2">
                {QUIZ_REVIEW.correctLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {scoreData.correctAnswers}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
                {QUIZ_REVIEW.incorrectLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {scoreData.incorrectAnswers}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {QUIZ_REVIEW.timeLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {formatTime(durationSeconds - timeLeftSeconds)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-[var(--space-lg)] shadow-sm">
          <h3 className="text-xl font-semibold text-foreground">
            {QUIZ_REVIEW.reviewTitle}
          </h3>

          <div className="mt-[var(--space-lg)] flex flex-col gap-[var(--space-lg)]">
            {reviewItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-background shadow-sm">
                <div className="flex flex-col gap-[var(--space-md)] p-[var(--space-lg)]">
                  <p className="text-lg font-semibold text-foreground">
                    {item.title}
                  </p>
                  <div className="grid gap-[var(--space-sm)]">
                    {item.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center justify-between rounded-lg border p-[var(--space-sm)] ${REVIEW_OPTION_STYLES[option.status]}`}
                      >
                        <span className={`text-sm ${REVIEW_OPTION_TEXT[option.status]}`}>
                          {option.label}
                        </span>
                        {option.status === "correct" ? (
                          <Check className="size-4 text-chart-2" />
                        ) : option.status === "incorrect" ? (
                          <X className="size-4 text-destructive" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border bg-muted px-[var(--space-lg)] py-[var(--space-md)]">
                  <div className="flex items-center gap-[var(--space-xs)] text-primary">
                    <Sparkles className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                      {QUIZ_REVIEW.explanationLabel}
                    </span>
                  </div>
                  <p className="mt-[var(--space-xs)] text-sm text-muted-foreground">
                    Correct option is highlighted in green. Your incorrect selected option, if any, is shown in red.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex justify-center pb-[var(--space-3xl)]">
          <div className="flex w-full max-w-[520px] flex-wrap items-center justify-center gap-[var(--space-md)]">
            <Button className="min-w-[160px]" onClick={handleRetake}>
              {QUIZ_REVIEW.retakeLabel}
            </Button>
            <Button variant="secondary" className="min-w-[160px]" onClick={handleRetake}>
              {QUIZ_REVIEW.backLabel}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "quiz" && currentQuestion) {
    return (
      <div className="grid gap-[var(--space-xl)] lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="mb-[var(--space-lg)] flex items-center justify-between gap-[var(--space-md)]">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {QUIZ_INTERFACE.questionLabel} {currentNumber} {QUIZ_INTERFACE.ofLabel} {totalQuestions}
            </span>
            <div className="flex items-center gap-[var(--space-xs)] text-primary text-lg font-semibold">
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>
          </div>

          <h3 className="mb-[var(--space-lg)] text-2xl font-semibold text-foreground">
            {currentQuestion.prompt}
          </h3>

          <div className="mb-[var(--space-lg)] flex flex-col gap-[var(--space-md)]">
            {currentQuestion.options.map((option) => {
              const isChecked = answers[String(currentNumber)] === option.id
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-[var(--space-md)] rounded-xl border px-[var(--space-lg)] py-[var(--space-md)] transition ${
                    isChecked
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/60 hover:bg-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    className="size-5 accent-primary"
                    checked={isChecked}
                    onChange={() => handleOptionSelect(option.id)}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                </label>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)] border-t border-border pt-[var(--space-lg)]">
            <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
              <Button variant="secondary" onClick={handlePrevious}>
                {QUIZ_INTERFACE.previousLabel}
              </Button>
              <Button variant="secondary" className="gap-2">
                <Flag className="size-4" />
                {QUIZ_INTERFACE.flagLabel}
              </Button>
            </div>
            <Button onClick={handleNext}>
              {currentNumber === totalQuestions
                ? QUIZ_INTERFACE.finishLabel
                : QUIZ_INTERFACE.nextLabel}
            </Button>
          </div>
        </section>

        <aside className="rounded-2xl border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-[var(--space-lg)] py-[var(--space-md)] text-lg font-semibold text-foreground">
            {QUIZ_INTERFACE.mapTitle}
          </h2>
          <div className="max-h-[60vh] overflow-y-auto p-[var(--space-md)]">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-[var(--space-xs)]">
              {Array.from({ length: totalQuestions }, (_, index) => {
                const id = index + 1
                const status =
                  id === currentNumber
                    ? "current"
                    : answeredIds.has(id)
                      ? "answered"
                      : "unanswered"
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleJumpToQuestion(id)}
                    className={`flex aspect-square min-h-10 items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${MAP_STATUS_CLASSES[status]}`}
                    title={status}
                  >
                    {id}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="border-t border-border bg-muted px-[var(--space-lg)] py-[var(--space-md)] text-xs">
            <div className="flex flex-col gap-[var(--space-xs)]">
              {QUIZ_MAP_LEGEND.map((legend) => (
                <div key={legend.id} className="flex items-center gap-[var(--space-xs)]">
                  <span className={`size-3 rounded-sm ${legend.className}`} />
                  <span className="text-muted-foreground">{legend.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <h1 className="text-3xl font-semibold text-foreground">
          {QUIZ_BUILDER_HEADER.title}
        </h1>
      </header>

      <section className="rounded-2xl border border-border bg-muted/40 p-[var(--space-xl)]">
        <h2 className="text-lg font-semibold text-foreground">
          {QUIZ_BUILDER_INSTRUCTIONS.title}
        </h2>
        <p className="mt-[var(--space-xs)] text-sm text-muted-foreground md:text-base">
          {QUIZ_BUILDER_INSTRUCTIONS.description}
        </p>
      </section>

      <section className="flex flex-col gap-[var(--space-md)]">
        <h2 className="text-lg font-semibold text-foreground">
          {QUIZ_BUILDER_CHAT.title}
        </h2>

        <div className="flex flex-col gap-[var(--space-lg)]">
          {QUIZ_BUILDER_MESSAGES.map((message) =>
            message.role === "assistant" ? (
              <div key={message.id} className="flex items-end gap-[var(--space-sm)]">
                <Avatar className="size-10 border border-border">
                  <AvatarImage src={message.avatarUrl} alt={message.label} />
                  {message.avatarFallback ? (
                    <AvatarFallback>{message.avatarFallback}</AvatarFallback>
                  ) : null}
                </Avatar>
                <div className="flex flex-1 flex-col gap-[var(--space-2xs)] items-start">
                  <p className="ml-[var(--space-2xs)] text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {message.label}
                  </p>
                  <div className="max-w-[480px] rounded-2xl rounded-bl-none border border-border bg-muted px-[var(--space-lg)] py-[var(--space-md)] text-sm text-foreground shadow-sm">
                    {message.message}
                  </div>
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex items-end gap-[var(--space-sm)] justify-end">
                <div className="flex flex-col gap-[var(--space-2xs)] items-end">
                  <p className="mr-[var(--space-2xs)] text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {message.label}
                  </p>
                  <div className="max-w-[480px] rounded-2xl rounded-br-none bg-primary px-[var(--space-lg)] py-[var(--space-md)] text-sm text-primary-foreground shadow-md">
                    {message.message}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-[var(--space-md)] flex items-center gap-[var(--space-sm)] border-t border-border pt-[var(--space-md)]">
          <div className="flex w-full items-center gap-[var(--space-sm)] rounded-xl border border-border bg-card px-[var(--space-md)] py-[var(--space-sm)] focus-within:ring-2 focus-within:ring-ring/30">
            <Input
              value={quizPrompt}
              onChange={(event) => {
                setQuizPrompt(event.target.value)
                if (errorMessage) {
                  setErrorMessage(null)
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  fetchQuiz()
                }
              }}
              placeholder={QUIZ_BUILDER_CHAT.inputPlaceholder}
              className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="text-primary">
              <Paperclip className="size-5" />
            </Button>
            <Button className="px-[var(--space-lg)]" onClick={fetchQuiz} disabled={loading}>
              {QUIZ_BUILDER_CHAT.sendLabel}
            </Button>
          </div>
        </div>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </section>
    </div>
  )
}
