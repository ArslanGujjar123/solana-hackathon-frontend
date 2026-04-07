"use client"

import { useState, useEffect } from "react"
import { STUDENT_DASHBOARD_HEADER } from "@/constants/student-dashboard";
import { Button } from "@/components/ui/button";

export function StudentDashboardHeader() {
  const [firstName, setFirstName] = useState("")

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setFirstName(parsedUser.first_name || parsedUser.username)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  return (
    <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="prose prose-sm dark:prose-invert max-w-xl">
        <p className="mt-0 mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {STUDENT_DASHBOARD_HEADER.eyebrow}
        </p>
        <h1 className="mt-0 mb-1 text-xl font-semibold tracking-tight">
          Hello, {firstName}!
        </h1>
        <p className="mt-0 text-[13px] leading-relaxed text-muted-foreground">
          {STUDENT_DASHBOARD_HEADER.subtitle}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm" variant="outline">
          <a href="/dashboard/student/my-project">View project</a>
        </Button>
        <Button asChild size="sm">
          <a href="/dashboard/student/sprints">Open sprint board</a>
        </Button>
      </div>
    </section>
  );
}
