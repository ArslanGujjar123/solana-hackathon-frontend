import {
  Activity,
  BarChart3,
  FileText,
  GraduationCap,
  Mail,
  PlusCircle,
  ShieldAlert,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
} from "lucide-react"

const kpiCards = [
  {
    id: "users",
    title: "Total Users",
    value: "12,450",
    trend: "+5.2%",
    icon: Users,
    tone: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "classes",
    title: "Total Classes",
    value: "482",
    trend: "+2.1%",
    icon: GraduationCap,
    tone: "text-violet-600",
    bg: "bg-violet-100/80 dark:bg-violet-500/15",
  },
  {
    id: "papers",
    title: "Total Papers",
    value: "3,120",
    trend: "+8.4%",
    icon: FileText,
    tone: "text-amber-600",
    bg: "bg-amber-100/80 dark:bg-amber-500/15",
  },
]

const activityItems = [
  {
    id: "upload",
    title: "New Paper Uploaded",
    description: "Quantum Physics Midterm by Prof. Sarah",
    time: "2 hours ago",
    icon: Upload,
    tone: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  },
  {
    id: "batch",
    title: "Batch Users Created",
    description: "50 new students added to CS101",
    time: "5 hours ago",
    icon: UserPlus,
    tone: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  {
    id: "alert",
    title: "System Alert",
    description: "High latency detected in AI inference API",
    time: "12 hours ago",
    icon: ShieldAlert,
    tone: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  },
]

const quickActions = [
  {
    id: "class",
    label: "Create Class",
    icon: PlusCircle,
  },
  {
    id: "notice",
    label: "Send Notice",
    icon: Mail,
  },
  {
    id: "audit",
    label: "Run Audit",
    icon: BarChart3,
  },
  {
    id: "help",
    label: "Help Desk",
    icon: Activity,
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Monitoring NextQ performance and user engagement.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {kpiCards.map((card) => {
          const Icon = card.icon
          return (
            <article
              key={card.id}
              className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`rounded-lg p-3 ${card.bg} ${card.tone}`}
                >
                  <Icon className="size-6" />
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <TrendingUp className="size-4" />
                  {card.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
            </article>
          )
        })}
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">User Growth</h3>
            <p className="text-sm text-muted-foreground">
              Daily active user joining trends
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-sm font-medium text-emerald-600">
              +1,240 joining this week
            </span>
            <div className="flex rounded-lg bg-muted p-1">
              <button className="rounded-md bg-card px-3 py-1 text-xs font-semibold shadow-sm">
                7 Days
              </button>
              <button className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                30 Days
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="relative flex h-80 w-full flex-col justify-end">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`grid-${index}`}
                  className="w-full border-t border-border"
                />
              ))}
            </div>
            <svg
              className="relative z-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 800 300"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 250 Q 60 220 120 240 T 240 180 T 360 210 T 480 120 T 600 150 T 720 80 T 800 100 V 300 H 0 Z"
                fill="url(#chartGradient)"
                className="text-primary"
              />
              <path
                d="M0 250 Q 60 220 120 240 T 240 180 T 360 210 T 480 120 T 600 150 T 720 80 T 800 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-primary"
              />
              <circle
                cx="480"
                cy="120"
                r="6"
                fill="currentColor"
                stroke="white"
                strokeWidth="2"
                className="text-primary"
              />
            </svg>
            <div className="mt-4 flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
            <button className="text-sm font-semibold text-primary hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-6">
            {activityItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex gap-4">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${item.tone}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase text-muted-foreground/70">
                      {item.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-foreground">Quick Actions</h3>
          <div className="grid flex-1 grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-4 transition-all hover:border-primary hover:bg-primary/5"
                >
                  <Icon className="mb-2 size-7 text-muted-foreground group-hover:text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    {action.label}
                  </span>
                </button>
              )
            })}
          </div>
        </article>
      </section>
    </div>
  )
}
