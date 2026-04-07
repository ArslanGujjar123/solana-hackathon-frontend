import { Bell, CreditCard, LogOut, Search, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { DashboardThemeToggle } from "./theme-toggle"

export function AdminTopNav() {
  return (
    <div className="flex flex-1 items-center justify-between gap-4 pr-6">
      <div className="relative hidden w-full max-w-md md:block">
        <p></p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
          aria-label="View notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2 size-2 rounded-full border-2 border-card bg-red-500" />
        </Button>
        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          aria-label="Open settings"
        >
          <Settings className="size-5" />
        </Button> */}
        <DashboardThemeToggle />
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">Alex Rivera</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
          {/* <div
            className="h-10 w-10 rounded-full border-2 border-primary/60 bg-muted bg-cover bg-center cursor-pointer"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwd9wm_U8y-TePnb_reNqzKK5GW95A_3XwXqSrXAD1HBXzI4lTX9DB4w_Y-bDQS2zYcLYjXI_abjcRkeG2GDUzz273muLCJONGkDuXWweawNte3e2t2Fs_w7BhLa9CCcVuQTqJkRld8ecEjW7TnbT8GHyEsO05IwV1l0x0629ZRU39MLbNQ91p3iZZhxDV7UZJSlzstqKppVMSd7MfcYiuZAyIxapMKCSUaC6BWZbFjfLGYOE6DCHcQ3okCWGWrbqyJIHV6FbWD6o')",
            }}
          /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="h-10 w-10 rounded-full border-2 border-primary/60 bg-muted bg-cover bg-center cursor-pointer"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwd9wm_U8y-TePnb_reNqzKK5GW95A_3XwXqSrXAD1HBXzI4lTX9DB4w_Y-bDQS2zYcLYjXI_abjcRkeG2GDUzz273muLCJONGkDuXWweawNte3e2t2Fs_w7BhLa9CCcVuQTqJkRld8ecEjW7TnbT8GHyEsO05IwV1l0x0629ZRU39MLbNQ91p3iZZhxDV7UZJSlzstqKppVMSd7MfcYiuZAyIxapMKCSUaC6BWZbFjfLGYOE6DCHcQ3okCWGWrbqyJIHV6FbWD6o')",
                }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="data-[state=active]:bg-foreground/10">
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="data-[state=active]:bg-sidebar-foreground/10">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Buy Credits</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 data-[state=active]:bg-red-500/10" data-variant="destructive">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
