import type { ReactNode } from "react"
import { cookies } from "next/headers"

import { DashboardTopNav } from "@/components/dashboard/top-nav"
import { AdminTopNav } from "@/components/dashboard/admin-top-nav"
import { StudentSidebar } from "@/components/shared/sidebar/student-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function StudentDashboardLayout({
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
      <StudentSidebar />
      <SidebarInset>
        {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <AdminTopNav />
        </header> */}
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
