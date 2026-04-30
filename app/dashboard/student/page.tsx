"use client"

import { useEffect, useState } from "react"
import { FileText, Gauge, ListChecks, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { dashboardApi, type StudentDashboardResponse } from "@/lib/api/dashboard"

const STAT_ICONS = {
  papers: FileText,
  quizzes: ListChecks,
  score: Gauge,
}

const CHART_TONE_CLASSES = {
  "chart-1": "text-chart-1",
  "chart-2": "text-chart-2",
}

const TREND_TONE_CLASSES = {
  positive: "text-accent",
  neutral: "text-muted-foreground",
}

export default function StudentHomePage() {
  const [data, setData] = useState<StudentDashboardResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await dashboardApi.getStudentDashboard()
        setData(response)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard")
      }
    }

    load()
  }, [])

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Loading dashboard...</p>
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <section className="flex flex-col gap-[var(--space-2xs)]">
        <h1 className="text-3xl font-semibold text-foreground">{data.header.title}</h1>
        <p className="text-sm text-muted-foreground md:text-base">{data.header.subtitle}</p>
      </section>

      <section className="grid gap-[var(--space-lg)] md:grid-cols-3">
        {data.stats.map((stat) => {
          const Icon = STAT_ICONS[stat.icon]
          return (
            <article
              key={stat.id}
              className="flex flex-col gap-[var(--space-sm)] rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-[var(--space-sm)] text-muted-foreground">
                <Icon className="size-5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
              <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
              {stat.trend ? (
                <div className={`flex items-center gap-[var(--space-xs)] text-xs font-medium ${TREND_TONE_CLASSES[stat.trend.tone]}`}>
                  {stat.trend.tone === "positive" ? <TrendingUp className="size-4" /> : null}
                  <span>{stat.trend.label}</span>
                </div>
              ) : null}
            </article>
          )
        })}
      </section>

      <section className="grid gap-[var(--space-lg)] lg:grid-cols-2">
        {data.charts.map((chart) => (
          <article
            key={chart.id}
            className="flex flex-col gap-[var(--space-md)] rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm"
          >
            <div className="flex items-center justify-between gap-[var(--space-md)]">
              <div>
                <p className="text-lg font-semibold text-foreground">{chart.title}</p>
                <p className="text-sm text-muted-foreground">{chart.subtitle}</p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-[var(--space-2xs)] bg-accent/10 text-accent">
                <TrendingUp className="size-3" />
                {chart.trendLabel}
              </Badge>
            </div>
            <div className="flex flex-col gap-[var(--space-md)]">
              <div className="h-[200px] w-full">
                <svg className={`h-full w-full ${CHART_TONE_CLASSES[chart.tone]}`} fill="none" viewBox="0 0 478 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={chart.gradientId} x1="239" x2="239" y1="1" y2="150" gradientUnits="userSpaceOnUse">
                      <stop stopColor="currentColor" stopOpacity="0.25" />
                      <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={chart.linePath} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d={chart.areaPath} fill={`url(#${chart.gradientId})`} />
                </svg>
              </div>
              <div className="flex justify-between px-[var(--space-xs)] text-xs font-semibold text-muted-foreground">
                {data.days.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
