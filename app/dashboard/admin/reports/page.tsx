import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Reply,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"

const reports = [
  {
    id: "john-doe",
    initials: "JD",
    initialsTone: "bg-blue-100 text-primary",
    name: "John Doe",
    subject: "Technical Issue - Upload Failure",
    snippet:
      "Hi support, I am having trouble uploading my PDF research paper. It keeps getting stuck at 99%...",
    time: "5 mins ago",
    unread: true,
  },
  {
    id: "robert-fox",
    initials: "RF",
    initialsTone: "bg-purple-100 text-purple-600",
    name: "Robert Fox",
    subject: "Account Access",
    snippet:
      "I cannot log in with my edu mail. I reset the password but no link arrived...",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "jane-smith",
    initials: "JS",
    initialsTone: "bg-muted text-muted-foreground",
    name: "Jane Smith",
    subject: "Feature Request - Grouping",
    snippet:
      "It would be great if we could categorize our papers into custom folders...",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: "albert-flores",
    initials: "AF",
    initialsTone: "bg-muted text-muted-foreground",
    name: "Albert Flores",
    subject: "Question about Papers",
    snippet:
      "How do I categorize a multi-disciplinary paper? Is there a tag system available?",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "cody-hunter",
    initials: "CH",
    initialsTone: "bg-muted text-muted-foreground",
    name: "Cody Hunter",
    subject: "System Downtime Query",
    snippet:
      "Was there a scheduled maintenance last night? I couldn't access the dashboard around 3 AM.",
    time: "Oct 12, 2023",
    unread: false,
  },
]

export default function AdminReportsPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Reports Inbox
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage user inquiries and technical support tickets.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted">
                <CheckCheck className="size-4" />
                Mark all as read
              </button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                New Inquiry
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports, users, or keywords..."
                className="w-full rounded-lg border border-transparent bg-transparent py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-3 border-border sm:border-l sm:pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sort by:
              </span>
              <select className="cursor-pointer bg-transparent text-sm font-semibold text-foreground focus:outline-none">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Priority</option>
              </select>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-12 px-6 py-3 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Subject &amp; Snippet
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Time
                </th>
                <th className="w-24 px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className={cn(
                    "group cursor-pointer transition-colors",
                    report.unread
                      ? "border-l-4 border-primary bg-card hover:bg-primary/5"
                      : "border-l-4 border-transparent bg-muted/40 hover:bg-muted"
                  )}
                >
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        report.unread ? "" : "opacity-75"
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                          report.initialsTone
                        )}
                      >
                        {report.initials}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          report.unread
                            ? "font-bold text-foreground"
                            : "font-medium text-muted-foreground"
                        )}
                      >
                        {report.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "flex max-w-xl flex-col",
                        report.unread ? "" : "opacity-75"
                      )}
                    >
                      <span
                        className={cn(
                          "line-clamp-1 text-sm",
                          report.unread
                            ? "font-bold text-foreground"
                            : "font-medium text-muted-foreground"
                        )}
                      >
                        {report.subject}
                      </span>
                      <span className="line-clamp-1 text-sm text-muted-foreground">
                        {report.snippet}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        report.unread
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {report.time}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded p-1.5 text-primary transition-colors hover:bg-primary/10">
                        <Reply className="size-4" />
                      </button>
                      <button className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-50">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-border bg-muted/50 p-4">
            <p className="text-xs font-bold text-muted-foreground">
              Showing 1-12 of 145 reports
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-border bg-card p-2 text-muted-foreground disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="size-4" />
              </button>
              <button className="rounded-lg border border-border bg-card p-2 text-muted-foreground hover:text-foreground">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
