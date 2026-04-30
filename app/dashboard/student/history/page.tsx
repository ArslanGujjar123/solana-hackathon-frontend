"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { dashboardApi, type StudentHistoryResponse } from "@/lib/api/dashboard"

type HistoryItemType = "paper" | "quiz"

const TYPE_BADGE_STYLES: Record<HistoryItemType, string> = {
  paper: "bg-primary/10 text-primary",
  quiz: "bg-accent/10 text-accent",
}

const TYPE_LABELS: Record<HistoryItemType, string> = {
  paper: "Paper",
  quiz: "Quiz",
}

export default function StudentHistoryPage() {
  const [data, setData] = useState<StudentHistoryResponse | null>(null)
  const [query, setQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await dashboardApi.getStudentHistory()
        setData(response)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load history")
      }
    }

    load()
  }, [])

  const filteredItems = useMemo(() => {
    if (!data) return []
    const search = query.trim().toLowerCase()
    if (!search) return data.items
    return data.items.filter(
      (item) => item.subject.toLowerCase().includes(search) || item.grade.toLowerCase().includes(search),
    )
  }, [data, query])

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Loading history...</p>
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)]">
        <h1 className="text-3xl font-semibold text-foreground">{data.header.title}</h1>
        <div className="w-full max-w-[320px]">
          <Input
            placeholder={data.header.searchPlaceholder}
            aria-label={data.header.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-sm @container">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <tr className="border-b border-border">
                {data.table.columns.map((column) => (
                  <th key={column} className="px-[var(--space-lg)] py-[var(--space-md)]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="transition hover:bg-muted/40">
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground">{item.id}</td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)]">
                    <Badge className={TYPE_BADGE_STYLES[item.type]}>{TYPE_LABELS[item.type]}</Badge>
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground">{item.grade}</td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground">{item.subject}</td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-center text-muted-foreground">{item.questions}</td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-center">
                    <Button variant="ghost" size="icon" className="text-primary" aria-label="View">
                      <Eye className="size-4" />
                    </Button>
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-center">
                    <Button variant="ghost" size="icon" className="text-chart-2" aria-label="Download">
                      <Download className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)]">
        <p className="text-sm text-muted-foreground">{data.table.showingLabel}</p>
        <div className="flex items-center gap-[var(--space-sm)]">
          <Button variant="secondary">{data.table.previousLabel}</Button>
          <Button variant="secondary">{data.table.nextLabel}</Button>
        </div>
      </div>
    </div>
  )
}
