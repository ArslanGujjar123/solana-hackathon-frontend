"use client"

import * as React from "react"
import {
  Command,
  LayoutDashboard,
  FolderKanban,
  Users,
  Flag,
  FileText,
  MessagesSquare,
  GraduationCap,
  Inbox,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/shared/nav/nav-main"
import { NavUser } from "@/components/shared/nav/nav-user"
import { SIDEBAR_BRAND, SIDEBAR_USER } from "@/constants/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const studentNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/student",
    icon: LayoutDashboard,
    tooltip: "Go to your main student dashboard",
  },
  {
    title: "Rank Paper",
    url: "/dashboard/student/rank-papers",
    icon: FolderKanban,
    tooltip: "View and manage your FYP project details",
  },
  {
    title: "Quiz",
    url: "/dashboard/student/quiz",
    icon: Flag,
    tooltip: "Track sprint tasks, deadlines, and progress",
  },
  {
    title: "History",
    url: "/dashboard/student/history",
    icon: FileText,
    tooltip: "Submit and review your project proposals",
  },
]

export function StudentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navItems = React.useMemo(
    () =>
      studentNavItems.map((item) => ({
        ...item,
        isActive: pathname === item.url,
      })),
    [pathname]
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 mt-2"
            >
              <a href="#">
                <div className="bg-primary/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <Command className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                  {SIDEBAR_BRAND.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={SIDEBAR_USER} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
