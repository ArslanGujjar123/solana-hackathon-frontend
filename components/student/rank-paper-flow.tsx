"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, RefreshCcw } from "lucide-react"

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
import {
  RANK_PAPER_ANALYSIS_BARS,
  RANK_PAPER_ANALYSIS_FILTERS,
  RANK_PAPER_CATEGORIES,
  RANK_PAPER_CONFIG,
  RANK_PAPER_CONFIG_COLUMNS,
  RANK_PAPER_HEADER,
  RANK_PAPER_LOADING,
  RANK_PAPER_RESULT,
  RANK_PAPER_SECTIONS,
} from "@/constants/student-rank-paper"

type RankPaperStep = "categories" | "config" | "loading" | "result"

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

  const activeCategory = useMemo(
    () => RANK_PAPER_CATEGORIES.find((category) => category.id === activeCategoryId),
    [activeCategoryId]
  )

  const allSelected = useMemo(
    () =>
      RANK_PAPER_CONFIG_COLUMNS.flatMap((column) => column.fields).every(
        (field) => Boolean(selections[field.id])
      ),
    [selections]
  )

  useEffect(() => {
    if (step !== "loading") {
      return
    }

    const timer = setTimeout(() => {
      setStep("result")
    }, 1400)

    return () => clearTimeout(timer)
  }, [step])

  const handleStartRanking = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    setSelections(createInitialSelections())
    setStep("config")
  }

  const handleBackToCategories = () => {
    setActiveCategoryId(null)
    setSelections(createInitialSelections())
    setStep("categories")
  }

  const handleBackToConfig = () => {
    if (activeCategory) {
      setStep("config")
    } else {
      setStep("categories")
    }
  }

  if (step === "loading" && activeCategory) {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="flex flex-col gap-[var(--space-sm)]">
            <h1 className="text-2xl font-semibold text-foreground">
              {RANK_PAPER_LOADING.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {RANK_PAPER_LOADING.subtitle}
            </p>
          </div>
          <div className="mt-[var(--space-xl)] flex flex-col gap-[var(--space-md)]">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </section>
      </div>
    )
  }

  if (step === "result" && activeCategory) {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)] border-b border-border bg-muted/40 px-[var(--space-xl)] py-[var(--space-lg)]">
            <h1 className="text-2xl font-semibold text-foreground">
              {RANK_PAPER_RESULT.title}
            </h1>
            <Button className="gap-2" size="lg">
              <Download className="size-4" />
              {RANK_PAPER_RESULT.downloadLabel}
            </Button>
          </div>
          <div className="flex flex-col gap-[var(--space-xl)] px-[var(--space-xl)] py-[var(--space-xl)]">
            {RANK_PAPER_SECTIONS.map((section, index) => (
              <section key={section.id}>
                <h3
                  className={`mb-[var(--space-md)] border-l-4 pl-[var(--space-sm)] text-lg font-semibold text-foreground ${section.accentClass}`}
                >
                  {section.title}
                </h3>
                <div className="prose prose-slate max-w-none text-sm leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground">
                  {section.type === "mcq"
                    ? section.items.map((item, itemIndex) => {
                        const mcqItem = item as { id: string; prompt: string; options: string }
                        return (
                          <p key={mcqItem.id}>
                            <strong>{itemIndex + 1}.</strong> {mcqItem.prompt}
                            <span className="mt-[var(--space-2xs)] block pl-[var(--space-md)] opacity-80">
                              {mcqItem.options}
                            </span>
                          </p>
                        )
                      })
                    : section.items.map((item, itemIndex) => {
                        const questionItem = item as { id: string; prompt: string }
                        return (
                          <p key={questionItem.id}>
                            <strong>{itemIndex + 1}.</strong> {questionItem.prompt}
                          </p>
                        )
                      })}
                </div>
              </section>
            ))}
          </div>
          <div className="border-t border-border bg-muted px-[var(--space-xl)] py-[var(--space-lg)]">
            <Button variant="secondary" className="gap-2" onClick={handleBackToConfig}>
              <RefreshCcw className="size-4" />
              {RANK_PAPER_RESULT.regenerateLabel}
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)]">
            <h2 className="text-xl font-semibold text-foreground">
              {RANK_PAPER_RESULT.analysisTitle}
            </h2>
            <div className="w-full max-w-[200px]">
              <Select value={analysisFilter} onValueChange={setAnalysisFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={RANK_PAPER_RESULT.analysisFilterPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {RANK_PAPER_ANALYSIS_FILTERS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-[var(--space-xl)] grid gap-[var(--space-xl)] md:grid-cols-4">
            <div className="md:col-span-1 md:border-r md:border-border md:pr-[var(--space-xl)]">
              <p className="text-sm font-medium text-muted-foreground">
                {RANK_PAPER_RESULT.frequencyLabel}
              </p>
              <p className="mt-[var(--space-2xs)] text-4xl font-semibold text-foreground">
                {RANK_PAPER_RESULT.frequencyValue}
              </p>
              <div className="mt-[var(--space-sm)] flex items-center gap-[var(--space-xs)]">
                <span className="text-xs text-muted-foreground">
                  {RANK_PAPER_RESULT.comparisonLabel}
                </span>
                <span className="rounded-full bg-accent/10 px-[var(--space-xs)] py-[var(--space-2xs)] text-xs font-semibold text-accent">
                  {RANK_PAPER_RESULT.comparisonDelta}
                </span>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="relative grid h-[200px] grid-flow-col items-end gap-[var(--space-md)] pb-[var(--space-lg)]">
                <div className="absolute inset-x-0 top-0 h-px bg-border/60" />
                <div className="absolute inset-x-0 top-1/4 h-px bg-border/60" />
                <div className="absolute inset-x-0 top-2/4 h-px bg-border/60" />
                <div className="absolute inset-x-0 top-3/4 h-px bg-border/60" />
                {RANK_PAPER_ANALYSIS_BARS.map((bar) => (
                  <div
                    key={bar.id}
                    className="flex h-full flex-col items-center justify-end gap-[var(--space-xs)]"
                  >
                    <div
                      className={`w-full max-w-[40px] rounded-t-md shadow-sm transition ${bar.toneClass}`}
                      style={{ height: `${bar.heightPercent}%` }}
                    />
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (step === "config" && activeCategory) {
    return (
      <div className="flex flex-col gap-[var(--space-lg)]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)] border-b border-border px-[var(--space-xl)] py-[var(--space-lg)]">
            <div className="flex flex-col gap-[var(--space-2xs)]">
              <h1 className="text-2xl font-semibold text-foreground">
                {RANK_PAPER_CONFIG.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {RANK_PAPER_CONFIG.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-[var(--space-sm)]">
              <Button variant="secondary" onClick={handleBackToCategories}>
                {RANK_PAPER_CONFIG.backLabel}
              </Button>
              <Button disabled={!allSelected} onClick={() => setStep("loading")}>
                {RANK_PAPER_CONFIG.submitLabel}
              </Button>
            </div>
          </div>

          <div className="grid gap-[var(--space-xl)] px-[var(--space-xl)] py-[var(--space-xl)] md:grid-cols-2">
            {RANK_PAPER_CONFIG_COLUMNS.map((column) => (
              <div key={column.id} className="flex flex-col gap-[var(--space-lg)]">
                {column.fields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-[var(--space-xs)]">
                    <Label htmlFor={field.id} className="text-sm font-semibold">
                      {field.label}
                    </Label>
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
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-muted px-[var(--space-xl)] py-[var(--space-lg)]">
            <p className="text-center text-xs text-muted-foreground">
              {RANK_PAPER_CONFIG.helperText}
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <section className="flex flex-col gap-[var(--space-xs)]">
        <h1 className="text-3xl font-semibold text-foreground">
          {RANK_PAPER_HEADER.title}
        </h1>
      </section>

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
              <p className="text-lg font-semibold text-foreground">
                {category.title}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
            </div>
            <Button
              className="mt-auto"
              size="lg"
              onClick={() => handleStartRanking(category.id)}
            >
              {category.ctaLabel}
            </Button>
          </article>
        ))}
      </section>
    </div>
  )
}

