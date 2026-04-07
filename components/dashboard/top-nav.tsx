import { Bell, Info } from "lucide-react"
import Link from "next/link"

import { DashboardThemeToggle } from "@/components/dashboard/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DASHBOARD_TOP_NAV } from "@/constants/dashboard"

export function DashboardTopNav() {
  return (
    <div className="fixed right-6 top-4 z-20 flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 backdrop-blur-md">
      {/* <Input
        type="search"
        placeholder={DASHBOARD_TOP_NAV.searchPlaceholder}
        aria-label={DASHBOARD_TOP_NAV.searchPlaceholder}
        className="h-8 border bg-background/40 text-sm placeholder:text-muted-foreground/80 rounded-full"
      /> */}
       {/* <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={DASHBOARD_TOP_NAV.infoAriaLabel}
      >
        <Info />
      </Button> */}
       
      <Button
        asChild
        type="button"
        variant="ghost"
        size="icon"
        aria-label={DASHBOARD_TOP_NAV.notificationsAriaLabel}
      >
        <Link href="/dashboard/student/notifications">
          <Bell />
        </Link>
      </Button>
      <DashboardThemeToggle />
       <Button
        asChild
        type="button"
        variant="ghost"
        size="icon"
        aria-label={DASHBOARD_TOP_NAV.notificationsAriaLabel}
      >
        <Link href="/dashboard/student/notifications">
          <Bell />
        </Link>
      </Button>
    </div>
  )
}
