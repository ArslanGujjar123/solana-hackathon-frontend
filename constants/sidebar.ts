export type SidebarItemKey =
  | "dashboard"
  | "rank-papers"
  | "quiz"
  | "history"
  | "profile"
  | "charts"
  | "users"

export type SidebarItem = {
  key: SidebarItemKey
  title: string
  href: string
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: "dashboard", title: "Dashboard", href: "/dashboard/student" },
  { key: "rank-papers", title: "Rank Paper", href: "/dashboard/student/rank-papers" },
  { key: "quiz", title: "Quiz", href: "/dashboard/student/quiz" },
  { key: "history", title: "History", href: "/dashboard/student/history" },
]

export const SIDEBAR_BRAND = {
  name: "NextQ",
  planLabel: "Student Portal",
  iconSrc: "/login_img.png",
}

export const SIDEBAR_MENU_LABEL = "NEXTQ"

export const SIDEBAR_DEFAULT_ITEM_KEY: SidebarItemKey = "dashboard"

export const SIDEBAR_USER = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}
