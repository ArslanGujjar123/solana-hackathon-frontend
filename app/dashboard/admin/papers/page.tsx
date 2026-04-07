import {
  Bell,
  Download,
  Eye,
  FileText,
  Filter,
  Pencil,
  Search,
  Settings,
  Trash2,
  UploadCloud,
} from "lucide-react"

import { cn } from "@/lib/utils"

const histogram = [
  { year: 2014, count: 120 },
  { year: 2015, count: 155 },
  { year: 2016, count: 240 },
  { year: 2017, count: 180 },
  { year: 2018, count: 310 },
  { year: 2019, count: 450 },
  { year: 2020, count: 80 },
  { year: 2021, count: 520 },
  { year: 2022, count: 290 },
  { year: 2023, count: 600 },
  { year: 2024, count: 210 },
]

const recentPapers = [
  {
    id: "math-2023",
    name: "Advanced Mathematics 2023 - Term 1",
    year: "2023",
    subject: "Mathematics",
    subjectTone: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    grade: "Grade 12",
    iconTone: "bg-red-50 text-red-500",
  },
  {
    id: "physics-2024",
    name: "Physics Mid-term Revision Paper",
    year: "2024",
    subject: "Physics",
    subjectTone: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    grade: "Grade 11",
    iconTone: "bg-blue-50 text-blue-500",
  },
]

const maxCount = Math.max(...histogram.map((item) => item.count))

export default function AdminPapersPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="space-y-8">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Admin</p>
            <h1 className="text-lg font-semibold text-foreground">
              Papers Analytics
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search papers..."
                className="w-64 rounded-lg bg-muted px-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-card bg-red-500" />
            </button>
            <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary">
              <Settings className="size-4" />
            </button>
          </div>
        </section>

        <section className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          {["Grade", "Subject", "Board"].map((label) => (
            <div key={label} className="flex-1 min-w-[200px]">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {label}
              </label>
              <select className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option>All {label}s</option>
                {label === "Grade" ? (
                  <>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </>
                ) : null}
                {label === "Subject" ? (
                  <>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>English</option>
                  </>
                ) : null}
                {label === "Board" ? (
                  <>
                    <option>IB Diploma</option>
                    <option>IGCSE</option>
                    <option>CBSE</option>
                    <option>Advanced Placement</option>
                  </>
                ) : null}
              </select>
            </div>
          ))}
          <div className="flex items-end">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90">
              <Filter className="size-4" />
              Apply Filters
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Paper Distribution by Year
              </h2>
              <p className="text-sm text-muted-foreground">
                Frequency of papers added since 2014
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="h-3 w-3 rounded-sm bg-primary" />
              Total Papers: 2,450
            </div>
          </div>

          <div className="relative h-80">
            <div className="absolute left-0 top-0 flex h-full flex-col justify-between pb-8 pr-4 text-[10px] font-bold text-muted-foreground">
              {Array.from({ length: 7 }).map((_, index) => (
                <span key={`axis-${index}`}>{(6 - index) * 100}</span>
              ))}
            </div>
            <div className="ml-12 h-full">
              <div className="absolute inset-0 ml-12 flex flex-col justify-between pb-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`grid-${index}`}
                    className="w-full border-b border-border"
                  />
                ))}
                <div className="border-b border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative z-10 flex h-full items-end justify-between gap-2 px-2 pb-8">
                {histogram.map((item) => {
                  const height = (item.count / maxCount) * 100
                  const highlight = item.year === 2023
                  return (
                    <div
                      key={item.year}
                      className="group relative flex flex-1 flex-col items-center"
                    >
                      <div className="absolute -top-6 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="rounded bg-slate-800 px-2 py-1 text-[10px] text-white">
                          {item.count} papers
                        </span>
                      </div>
                      <div
                        className={cn(
                          "w-full rounded-t-sm bg-primary/80 transition-all hover:bg-primary",
                          highlight &&
                            "bg-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900"
                        )}
                        style={{ height: `${height}%` }}
                      />
                      <span
                        className={cn(
                          "absolute -bottom-6 text-[10px] font-bold text-muted-foreground transition-colors group-hover:text-primary",
                          highlight && "text-primary"
                        )}
                      >
                        {item.year}
                      </span>
                    </div>
                  )}
                )}
                
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center border-t border-border/50 pt-4">
            <p className="text-[11px] font-medium text-muted-foreground">
              X-Axis: Academic Year | Y-Axis: Number of Papers Processed
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-6">
            <h3 className="text-lg font-bold text-foreground">
              Recent Papers Added
            </h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <Download className="size-4" />
                Export
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                <UploadCloud className="size-4" />
                Add New
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Paper Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Year
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentPapers.map((paper) => (
                  <tr
                    key={paper.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-lg p-2",
                            paper.iconTone
                          )}
                        >
                          <FileText className="size-5" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {paper.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {paper.year}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-bold",
                          paper.subjectTone
                        )}
                      >
                        {paper.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {paper.grade}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded p-2 text-muted-foreground transition-colors hover:text-primary"
                          title="View"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          className="rounded p-2 text-muted-foreground transition-colors hover:text-primary"
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          className="rounded p-2 text-muted-foreground transition-colors hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">2</span> of{" "}
              <span className="font-bold text-foreground">128</span> papers
            </p>
            <div className="flex gap-2">
              <button
                className="rounded border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground"
                disabled
              >
                Previous
              </button>
              <button className="rounded border border-primary bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                1
              </button>
              <button className="rounded border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted">
                2
              </button>
              <button className="rounded border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted">
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
