"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DASHBOARD_TOP_NAV } from "@/constants/dashboard"

type Theme = "light" | "dark"

export function DashboardThemeToggle() {
  const [theme, setTheme] = React.useState<Theme | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const stored = window.localStorage.getItem("theme") as Theme | null
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches

    const initial: Theme =
      stored === "light" || stored === "dark"
        ? stored
        : prefersDark
          ? "dark"
          : "light"

    setTheme(initial)
    document.documentElement.classList.toggle("dark", initial === "dark")
  }, [])

  const handleToggle = React.useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark"

      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", next === "dark")
        window.localStorage.setItem("theme", next)
      }

      return next
    })
  }, [])

  const isDark = theme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={DASHBOARD_TOP_NAV.themeToggleAriaLabel}
      onClick={handleToggle}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  )
}

