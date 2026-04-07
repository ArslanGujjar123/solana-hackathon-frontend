export type StudentHomeStat = {
  id: string
  label: string
  value: string
  trend?: {
    label: string
    tone: "positive" | "neutral"
  }
  icon: "papers" | "quizzes" | "score"
}

export type StudentHomeChart = {
  id: string
  title: string
  subtitle: string
  trendLabel: string
  linePath: string
  areaPath: string
  gradientId: string
  tone: "chart-1" | "chart-2"
}

export const STUDENT_HOME_HEADER = {
  title: "Dashboard",
  subtitle: "Welcome back, Ethan. Here's your learning progress.",
}

export const STUDENT_HOME_STATS: StudentHomeStat[] = [
  {
    id: "papers",
    label: "Papers Ranked",
    value: "12",
    trend: { label: "+2 this week", tone: "positive" },
    icon: "papers",
  },
  {
    id: "quizzes",
    label: "Quizzes Taken",
    value: "5",
    trend: { label: "+1 this week", tone: "positive" },
    icon: "quizzes",
  },
  {
    id: "average-score",
    label: "Average Score",
    value: "85%",
    trend: { label: "Top 15% of users", tone: "neutral" },
    icon: "score",
  },
]

export const STUDENT_HOME_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const STUDENT_HOME_CHARTS: StudentHomeChart[] = [
  {
    id: "papers-ranked",
    title: "Papers Ranked Over Time",
    subtitle: "Daily activity for the last 7 days",
    trendLabel: "10%",
    linePath:
      "M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25",
    areaPath:
      "M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z",
    gradientId: "gradient-papers",
    tone: "chart-1",
  },
  {
    id: "quizzes-taken",
    title: "Quizzes Taken Over Time",
    subtitle: "Engagement levels this week",
    trendLabel: "5%",
    linePath:
      "M0 80C20 80 30 140 50 140C70 140 80 40 100 40C120 40 130 110 150 110C170 110 180 20 200 20C220 20 230 90 250 90C270 90 280 60 300 60C320 60 330 130 350 130C370 130 380 10 400 10C420 10 430 80 450 80C470 80 478 40 478 40",
    areaPath:
      "M0 80C20 80 30 140 50 140C70 140 80 40 100 40C120 40 130 110 150 110C170 110 180 20 200 20C220 20 230 90 250 90C270 90 280 60 300 60C320 60 330 130 350 130C370 130 380 10 400 10C420 10 430 80 450 80C470 80 478 40 478 40V150H0V80Z",
    gradientId: "gradient-quizzes",
    tone: "chart-2",
  },
]
