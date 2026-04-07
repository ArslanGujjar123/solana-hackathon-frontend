"use client"

import * as React from "react"
import {
  BarChart3,
  BookOpen,
  FileText,
  LayoutDashboard,
  UploadCloud,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/shared/nav/nav-main"
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

const adminNavItems = [
  {
    title: "Home",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
    tooltip: "Overview of the admin dashboard",
  },
  {
    title: "Users",
    url: "/dashboard/admin/users",
    icon: Users,
    tooltip: "Manage platform users",
  },
  {
    title: "Papers",
    url: "/dashboard/admin/papers",
    icon: FileText,
    tooltip: "Review uploaded papers",
  },
  {
    title: "Upload Paper",
    url: "/dashboard/admin/upload-papers",
    icon: UploadCloud,
    tooltip: "Upload a new paper",
  },
  {
    title: "Reports",
    url: "/dashboard/admin/reports",
    icon: BarChart3,
    tooltip: "View platform reports",
  },
]

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navItems = React.useMemo(
    () =>
      adminNavItems.map((item) => ({
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
              <Link href="/dashboard/admin">
                <div className="bg-primary/20 flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
                  NextQ Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-xl border border-border bg-card p-4 text-xs">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            System Status
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            AI Engine Online
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
