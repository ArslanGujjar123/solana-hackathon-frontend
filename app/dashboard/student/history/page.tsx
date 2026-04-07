import { Download, Eye } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  STUDENT_HISTORY_HEADER,
  STUDENT_HISTORY_ITEMS,
  STUDENT_HISTORY_TABLE,
  type HistoryItemType,
} from "@/constants/student-history"

const TYPE_BADGE_STYLES: Record<HistoryItemType, string> = {
  paper: "bg-primary/10 text-primary",
  quiz: "bg-accent/10 text-accent",
}

const TYPE_LABELS: Record<HistoryItemType, string> = {
  paper: "Paper",
  quiz: "Quiz",
}

export default function StudentHistoryPage() {
  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)]">
        <h1 className="text-3xl font-semibold text-foreground">
          {STUDENT_HISTORY_HEADER.title}
        </h1>
        <div className="w-full max-w-[320px]">
          <Input
            placeholder={STUDENT_HISTORY_HEADER.searchPlaceholder}
            aria-label={STUDENT_HISTORY_HEADER.searchPlaceholder}
          />
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-sm @container">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-[var(--space-lg)] py-[var(--space-md)] @[max-width:150px]:hidden">
                  {STUDENT_HISTORY_TABLE.columns[0]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)] @[max-width:300px]:hidden">
                  {STUDENT_HISTORY_TABLE.columns[1]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)] @[max-width:400px]:hidden">
                  {STUDENT_HISTORY_TABLE.columns[2]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)] @[max-width:550px]:hidden">
                  {STUDENT_HISTORY_TABLE.columns[3]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)] text-center @[max-width:650px]:hidden">
                  {STUDENT_HISTORY_TABLE.columns[4]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)] text-center @[max-width:750px]:hidden">
                  {STUDENT_HISTORY_TABLE.columns[5]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)] text-center @[max-width:850px]:hidden">
                  {STUDENT_HISTORY_TABLE.columns[6]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {STUDENT_HISTORY_ITEMS.map((item) => (
                <tr key={item.id} className="transition hover:bg-muted/40">
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground @[max-width:150px]:hidden">
                    {item.id}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] @[max-width:300px]:hidden">
                    <Badge className={TYPE_BADGE_STYLES[item.type]}>
                      {TYPE_LABELS[item.type]}
                    </Badge>
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground @[max-width:400px]:hidden">
                    {item.grade}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground @[max-width:550px]:hidden">
                    {item.subject}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-center text-muted-foreground @[max-width:650px]:hidden">
                    {item.questions}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-center @[max-width:750px]:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary"
                      aria-label="View"
                    >
                      <Eye className="size-4" />
                    </Button>
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-center @[max-width:850px]:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-chart-2"
                      aria-label="Download"
                    >
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
        <p className="text-sm text-muted-foreground">
          {STUDENT_HISTORY_TABLE.showingLabel}
        </p>
        <div className="flex items-center gap-[var(--space-sm)]">
          <Button variant="secondary">{STUDENT_HISTORY_TABLE.previousLabel}</Button>
          <Button variant="secondary">{STUDENT_HISTORY_TABLE.nextLabel}</Button>
        </div>
      </div>
    </div>
  )
}
