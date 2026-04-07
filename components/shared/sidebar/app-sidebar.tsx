"use client"

import * as React from "react"
import {
  BarChart3,
  Command,
  FileText,
  Home,
  Layers3,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

import { NavMain } from "@/components/shared/nav/nav-main"
import {
  SIDEBAR_BRAND,
  SIDEBAR_DEFAULT_ITEM_KEY,
  SIDEBAR_ITEMS,
  SIDEBAR_USER,
  type SidebarItemKey,
} from "@/constants/sidebar"
import { NavUser } from "@/components/shared/nav/nav-user"
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

const sidebarIconByKey: Record<SidebarItemKey, LucideIcon> = {
  dashboard: Home,
  "rank-papers": Users,
  "quiz": Layers3,
  history: FileText,
  profile: User,
  charts: BarChart3,
  users: Users,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMain = React.useMemo(
    () =>
      SIDEBAR_ITEMS.map((item) => {
        const Icon = sidebarIconByKey[item.key]

        return {
          title: item.title,
          url: item.href,
          icon: Icon,
          isActive: item.key === SIDEBAR_DEFAULT_ITEM_KEY,
        }
      }),
    []
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
                <div className="bg-primary/20 flex size-6 shrink-0 items-center justify-center rounded-lg">
                  <Command className="h-4 w-4" />
                </div>
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
                  {SIDEBAR_BRAND.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={SIDEBAR_USER} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

