import type { ReactNode } from "react"
import { cookies } from "next/headers"

import { AdminTopNav } from "@/components/dashboard/admin-top-nav"
import { AdminSidebar } from "@/components/shared/sidebar/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar_state")
  const initialOpen =
    sidebarCookie?.value === "true"
      ? true
      : sidebarCookie?.value === "false"
        ? false
        : false

  return (
    <SidebarProvider defaultOpen={initialOpen}>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-border bg-card">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <AdminTopNav />
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
