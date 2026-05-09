"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Download, RefreshCcw, UploadCloud } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { paperApi, uploadApi } from "@/lib/api/client"
import {
  RANK_PAPER_ANALYSIS_BARS,
  RANK_PAPER_ANALYSIS_FILTERS,
  RANK_PAPER_CATEGORIES,
  RANK_PAPER_CONFIG,
  RANK_PAPER_CONFIG_COLUMNS,
  RANK_PAPER_HEADER,
  RANK_PAPER_LOADING,
  RANK_PAPER_RESULT,
} from "@/constants/student-rank-paper"

type RankPaperStep = "categories" | "config" | "loading" | "result" | "upload"

const createInitialSelections = () =>
  Object.fromEntries(
    RANK_PAPER_CONFIG_COLUMNS.flatMap((column) =>
      column.fields.map((field) => [field.id, ""])
    )
  )

export function RankPaperFlow() {
  const [step, setStep] = useState<RankPaperStep>("categories")
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [analysisFilter, setAnalysisFilter] = useState(
    RANK_PAPER_ANALYSIS_FILTERS[0]?.value ?? ""
  )
  const [selections, setSelections] = useState<Record<string, string>>(
    createInitialSelections
  )
  const [generatedPaper, setGeneratedPaper] = useState<{
    id: string
    subject: string
    download_url: string | null
    paper_payload: unknown
  } | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    reward_tokens: number
    ai_score: number | null
  } | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeCategory = useMemo(
    () => RANK_PAPER_CATEGORIES.find((c) => c.id === activeCategoryId),
    [activeCategoryId]
  )

  const allSelected = useMemo(
    () =>
      RANK_PAPER_CONFIG_COLUMNS.flatMap((col) => col.fields).every(
        (field) => Boolean(selections[field.id])
      ),
    [selections]
  )

  // Generate paper when entering loading step
  useEffect(() => {
    if (step !== "loading") return

    const subject = selections["subject"] || activeCategory?.title || "General"

    paperApi
      .generate(subject)
      .then((paper) => {
        setGeneratedPaper({
          id: paper.id,
          subject: paper.subject,
          download_url: paper.download_url,
          paper_payload: paper.paper_payload,
        })
        setGenerateError(null)
        setStep("result")
      })
      .catch((err) => {
        setGenerateError(
          err instanceof Error ? err.message : "Failed to generate paper."
        )
        setStep("config")
      })
  }, [step, selections, activeCategory])

  const handleStartRanking = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    setSelections(createInitialSelections())
    setGeneratedPaper(null)
    setGenerateError(null)
    setStep("config")
  }

  const handleBackToCategories = () => {
    setActiveCategoryId(null)
    setSelections(createInitialSelections())
    setGeneratedPaper(null)
    setGenerateError(null)
    setStep("categories")
  }

  const handleBackToConfig = () => {
    setGeneratedPaper(null)
    setGenerateError(null)
    setStep(activeCategory ? "config" : "categories")
  }

  const handleUploadFile = async () => {
    if (!uploadFile) return
    setUploading(true)
    setUploadError(null)
    try {
      const result = await uploadApi.submit(uploadFile)
      setUploadResult({ reward_tokens: result.reward_tokens, ai_score: result.ai_score })
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  // -------------------------------------------------------------------------
  // Loading
  // -------------------------------------------------------------------------
  if (step === "loading") {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="flex flex-col gap-[var(--space-sm)]">
            <h1 className="text-2xl font-semibold text-foreground">{RANK_PAPER_LOADING.title}</h1>
            <p className="text-sm text-muted-foreground">{RANK_PAPER_LOADING.subtitle}</p>
          </div>
          <div className="mt-[var(--space-xl)] flex flex-col gap-[var(--space-md)]">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </section>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Result
  // -------------------------------------------------------------------------
  if (step === "result" && generatedPaper) {
    const payload = generatedPaper.paper_payload as Record<string, unknown> | null
    const title =
      typeof payload?.title === "string"
        ? payload.title
        : `${generatedPaper.subject} Practice Paper`
    const sections = Array.isArray(payload?.sections) ? (payload.sections as string[]) : []

    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)] border-b border-border bg-muted/40 px-[var(--space-xl)] py-[var(--space-lg)]">
            <h1 className="text-2xl font-semibold text-foreground">{RANK_PAPER_RESULT.title}</h1>
            {generatedPaper.download_url && (
              <Button className="gap-2" size="lg" asChild>
                <a href={generatedPaper.download_url} target="_blank" rel="noopener noreferrer">
                  <Download className="size-4" />
                  {RANK_PAPER_RESULT.downloadLabel}
                </a>
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-[var(--space-xl)] px-[var(--space-xl)] py-[var(--space-xl)]">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            {sections.length > 0 ? (
              <div className="flex flex-col gap-[var(--space-md)]">
                {sections.map((section, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/40 p-[var(--space-lg)]">
                    <p className="font-semibold text-foreground">{section}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Questions generated by AI when service is connected.
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Paper content is ready. Connect the Hugging Face AI service to generate full questions.
              </p>
            )}
          </div>

          <div className="border-t border-border bg-muted px-[var(--space-xl)] py-[var(--space-lg)]">
            <Button variant="secondary" className="gap-2" onClick={handleBackToConfig}>
              <RefreshCcw className="size-4" />
              {RANK_PAPER_RESULT.regenerateLabel}
            </Button>
          </div>
        </section>

        {/* Analysis */}
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)]">
            <h2 className="text-xl font-semibold text-foreground">{RANK_PAPER_RESULT.analysisTitle}</h2>
            <div className="w-full max-w-[200px]">
              <Select value={analysisFilter} onValueChange={setAnalysisFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={RANK_PAPER_RESULT.analysisFilterPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {RANK_PAPER_ANALYSIS_FILTERS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-[var(--space-xl)] grid gap-[var(--space-xl)] md:grid-cols-4">
            <div className="md:col-span-1 md:border-r md:border-border md:pr-[var(--space-xl)]">
              <p className="text-sm font-medium text-muted-foreground">{RANK_PAPER_RESULT.frequencyLabel}</p>
              <p className="mt-[var(--space-2xs)] text-4xl font-semibold text-foreground">{RANK_PAPER_RESULT.frequencyValue}</p>
            </div>
            <div className="md:col-span-3">
              <div className="relative grid h-[200px] grid-flow-col items-end gap-[var(--space-md)] pb-[var(--space-lg)]">
                {RANK_PAPER_ANALYSIS_BARS.map((bar) => (
                  <div key={bar.id} className="flex h-full flex-col items-center justify-end gap-[var(--space-xs)]">
                    <div
                      className={`w-full max-w-[40px] rounded-t-md shadow-sm transition ${bar.toneClass}`}
                      style={{ height: `${bar.heightPercent}%` }}
                    />
                    <span className="text-[11px] font-semibold text-muted-foreground">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Upload
  // -------------------------------------------------------------------------
  if (step === "upload") {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <h1 className="mb-4 text-2xl font-semibold text-foreground">Upload Past Paper</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Upload a past paper PDF to earn COIN. Our AI will score it and credit 0–50 COIN.
          </p>

          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-10 text-center transition hover:border-primary/50 hover:bg-primary/5">
            <UploadCloud className="mb-3 size-10 text-primary/60 transition group-hover:scale-110" />
            <p className="font-semibold text-foreground">
              {uploadFile ? uploadFile.name : "Drag & drop PDF here"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">or click to browse (PDF, max 10 MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setUploadFile(f)
              }}
            />
          </label>

          {uploadError && <p className="mt-3 text-sm text-destructive">{uploadError}</p>}

          {uploadResult && (
            <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-4 dark:bg-green-900/20">
              <p className="font-semibold text-green-800 dark:text-green-300">
                Upload successful! +{uploadResult.reward_tokens} COIN earned
              </p>
              {uploadResult.ai_score !== null && (
                <p className="text-sm text-green-700 dark:text-green-400">
                  AI Score: {uploadResult.ai_score}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button disabled={!uploadFile || uploading} onClick={handleUploadFile} className="gap-2">
              <UploadCloud className="size-4" />
              {uploading ? "Uploading…" : "Upload & Earn COIN"}
            </Button>
            <Button variant="secondary" onClick={handleBackToCategories}>Back</Button>
          </div>
        </section>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Config
  // -------------------------------------------------------------------------
  if (step === "config" && activeCategory) {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        {generateError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {generateError}
          </div>
        )}
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)] border-b border-border px-[var(--space-xl)] py-[var(--space-lg)]">
            <div className="flex flex-col gap-[var(--space-2xs)]">
              <h1 className="text-2xl font-semibold text-foreground">{RANK_PAPER_CONFIG.title}</h1>
              <p className="text-sm text-muted-foreground">{RANK_PAPER_CONFIG.subtitle}</p>
            </div>
            <div className="flex items-center gap-[var(--space-sm)]">
              <Button variant="secondary" onClick={handleBackToCategories}>{RANK_PAPER_CONFIG.backLabel}</Button>
              <Button disabled={!allSelected} onClick={() => setStep("loading")}>{RANK_PAPER_CONFIG.submitLabel}</Button>
            </div>
          </div>

          <div className="grid gap-[var(--space-xl)] px-[var(--space-xl)] py-[var(--space-xl)] md:grid-cols-2">
            {RANK_PAPER_CONFIG_COLUMNS.map((column) => (
              <div key={column.id} className="flex flex-col gap-[var(--space-lg)]">
                {column.fields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-[var(--space-xs)]">
                    <Label htmlFor={field.id} className="text-sm font-semibold">{field.label}</Label>
                    <Select
                      value={selections[field.id]}
                      onValueChange={(value) =>
                        setSelections((prev) => ({ ...prev, [field.id]: value }))
                      }
                    >
                      <SelectTrigger id={field.id} className="h-11">
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-muted px-[var(--space-xl)] py-[var(--space-lg)]">
            <p className="text-center text-xs text-muted-foreground">{RANK_PAPER_CONFIG.helperText}</p>
          </div>
        </section>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Categories (default)
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <section className="flex flex-col gap-[var(--space-xs)]">
        <h1 className="text-3xl font-semibold text-foreground">{RANK_PAPER_HEADER.title}</h1>
        <p className="text-sm text-muted-foreground">
          Generate a practice paper (costs 10 COIN) or upload a past paper to earn COIN.
        </p>
      </section>

      {/* Upload card */}
      <section
        className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-[var(--space-lg)] transition hover:bg-primary/10"
        onClick={() => setStep("upload")}
      >
        <UploadCloud className="size-8 shrink-0 text-primary" />
        <div>
          <p className="font-semibold text-foreground">Upload a Past Paper</p>
          <p className="text-sm text-muted-foreground">
            Earn 0–50 COIN — AI scores your upload for quality and uniqueness.
          </p>
        </div>
        <Button className="ml-auto shrink-0" variant="secondary" size="sm">Upload</Button>
      </section>

      {/* Generate paper categories */}
      <section className="grid gap-[var(--space-lg)] md:grid-cols-2 lg:grid-cols-3">
        {RANK_PAPER_CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="flex h-full flex-col gap-[var(--space-md)] rounded-2xl border border-border bg-card p-[var(--space-lg)] shadow-sm transition hover:shadow-md"
          >
            <div
              className="aspect-video w-full rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url("${category.imageUrl}")` }}
            />
            <div className="flex flex-col gap-[var(--space-2xs)]">
              <p className="text-lg font-semibold text-foreground">{category.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{category.description}</p>
            </div>
            <Button className="mt-auto" size="lg" onClick={() => handleStartRanking(category.id)}>
              {category.ctaLabel}
            </Button>
          </article>
        ))}
      </section>
    </div>
  )
}
