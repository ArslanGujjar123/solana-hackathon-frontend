"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Flag, Paperclip, Sparkles, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  QUIZ_BUILDER_CHAT,
  QUIZ_BUILDER_HEADER,
  QUIZ_BUILDER_INSTRUCTIONS,
  QUIZ_BUILDER_MESSAGES,
  QUIZ_INITIAL_ANSWERED_IDS,
  QUIZ_INTERFACE,
  QUIZ_LOADING,
  QUIZ_MAP_LEGEND,
  QUIZ_QUESTIONS,
  QUIZ_REVIEW,
  QUIZ_REVIEW_ITEMS,
} from "@/constants/student-quiz"

type QuizStep = "builder" | "loading" | "quiz" | "review"

type QuizAnswerMap = Record<string, string>

const MAP_STATUS_CLASSES: Record<"answered" | "current" | "unanswered", string> = {
  answered: "bg-primary/10 text-primary border border-primary/20",
  current:
    "bg-accent/20 text-foreground border border-accent/30 ring-2 ring-primary/40",
  unanswered: "bg-muted text-muted-foreground border border-border",
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
  const [step, setStep] = useState<QuizStep>("builder")
  const [currentIndex, setCurrentIndex] = useState(4)
  const [answers, setAnswers] = useState<QuizAnswerMap>({})

  const currentQuestion = QUIZ_QUESTIONS[currentIndex]
  const totalQuestions = QUIZ_QUESTIONS.length
  const currentNumber = currentIndex + 1

  const answeredIds = useMemo(() => {
    const answered = new Set(QUIZ_INITIAL_ANSWERED_IDS)
    Object.keys(answers).forEach((id) => {
      const numericId = Number(id)
      if (!Number.isNaN(numericId)) {
        answered.add(numericId)
      }
    })
    return answered
  }, [answers])

  useEffect(() => {
    if (step !== "loading") {
      return
    }

    const timer = setTimeout(() => {
      setStep("quiz")
    }, 1400)

    return () => clearTimeout(timer)
  }, [step])

  const handleSend = () => {
    setStep("loading")
  }

  const handleOptionSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [String(currentNumber)]: optionId }))
  }

  const handleJumpToQuestion = (questionNumber: number) => {
    setCurrentIndex(questionNumber - 1)
  }

  const handleNext = () => {
    if (currentNumber === totalQuestions) {
      setStep("review")
      return
    }

    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  if (step === "loading") {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="flex flex-col gap-[var(--space-sm)]">
            <h1 className="text-2xl font-semibold text-foreground">
              {QUIZ_LOADING.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {QUIZ_LOADING.subtitle}
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
                {QUIZ_REVIEW.scoreValue}
              </p>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${QUIZ_REVIEW.scorePercent}%` }}
              />
            </div>
          </div>

          <div className="grid gap-[var(--space-md)] px-[var(--space-lg)] pb-[var(--space-lg)] md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {QUIZ_REVIEW.totalLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {QUIZ_REVIEW.totalValue}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-chart-2">
                {QUIZ_REVIEW.correctLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {QUIZ_REVIEW.correctValue}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
                {QUIZ_REVIEW.incorrectLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {QUIZ_REVIEW.incorrectValue}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-[var(--space-lg)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {QUIZ_REVIEW.timeLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {QUIZ_REVIEW.timeValue}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-[var(--space-lg)] shadow-sm">
          <h3 className="text-xl font-semibold text-foreground">
            {QUIZ_REVIEW.reviewTitle}
          </h3>

          <div className="mt-[var(--space-lg)] flex flex-col gap-[var(--space-lg)]">
            {QUIZ_REVIEW_ITEMS.map((item) => (
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
                    {item.explanation}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex justify-center pb-[var(--space-3xl)]">
          <div className="flex w-full max-w-[520px] flex-wrap items-center justify-center gap-[var(--space-md)]">
            <Button className="min-w-[160px]">
              {QUIZ_REVIEW.retakeLabel}
            </Button>
            <Button variant="secondary" className="min-w-[160px]">
              {QUIZ_REVIEW.backLabel}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "quiz" && currentQuestion) {
    return (
      <div className="grid gap-[var(--space-xl)] lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="mb-[var(--space-lg)] flex items-center justify-between gap-[var(--space-md)]">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {QUIZ_INTERFACE.questionLabel} {currentNumber} {QUIZ_INTERFACE.ofLabel} {totalQuestions}
            </span>
            <div className="flex items-center gap-[var(--space-xs)] text-primary text-lg font-semibold">
              <span>{QUIZ_INTERFACE.timerLabel}</span>
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
          <div className="p-[var(--space-md)]">
            <div className="grid grid-cols-5 gap-[var(--space-xs)]">
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
                    className={`flex aspect-square items-center justify-center rounded-lg text-sm font-semibold ${MAP_STATUS_CLASSES[status]}`}
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
              placeholder={QUIZ_BUILDER_CHAT.inputPlaceholder}
              className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="text-primary">
              <Paperclip className="size-5" />
            </Button>
            <Button className="px-[var(--space-lg)]" onClick={handleSend}>
              {QUIZ_BUILDER_CHAT.sendLabel}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
