"use client"

import { useState, useEffect } from "react"
import {
  STUDENT_DASHBOARD_OVERVIEW_CARDS,
  STUDENT_DASHBOARD_PROJECT_PROGRESS,
} from "@/constants/student-dashboard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from "@/components/animate-ui/components/animate/avatar-group";

export function StudentDashboardOverviewRow() {
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
  const progressPercent = STUDENT_DASHBOARD_PROJECT_PROGRESS.valuePercent;

  const overviewCards = STUDENT_DASHBOARD_OVERVIEW_CARDS.filter(
    (card) => card.id !== "sprint" && card.id !== "project",
  );

  const groupMembers = [
    {
      src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=160&h=160&q=80",
      fallback: "AS",
      tooltip: "Ali Shah - Team lead",
    },
    {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=160&h=160&q=80",
      fallback: "BF",
      tooltip: "Bisma Faisal - Backend",
    },
    {
      src: "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?auto=format&fit=facearea&w=160&h=160&q=80",
      fallback: "CH",
      tooltip: "Cyrus Haider - Frontend",
    },
    {
      src: "https://images.unsplash.com/photo-1544723795-3fb0b90cffc6?auto=format&fit=facearea&w=160&h=160&q=80",
      fallback: "DN",
      tooltip: "Dania Nazir - Research",
    },
  ];

  const advisors = [
    {
      src: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=facearea&w=160&h=160&q=80",
      fallback: "ZA",
      tooltip: "Dr. Zain Ali - Advisor",
    },
    {
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&w=160&h=160&q=80",
      fallback: "RK",
      tooltip: "Prof. Rida Khan - Co-advisor",
    },
  ];

  return (
    <section className="grid auto-rows-min gap-3 md:grid-cols-4">
      <div className="bg-card border border-border flex flex-col rounded-xl p-3">
        <p className="text-xs font-medium tracking-tight text-muted-foreground">
          Welcome back
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug">
          Hello, {firstName}!
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          Great to see you again. Here&apos;s a quick look at your FYP
          progress today.
        </p>

        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-tight text-muted-foreground">
              Group members
            </p>
            <AvatarGroup>
              {groupMembers.map((avatar, index) => (
                <Avatar key={index}>
                  <AvatarImage src={avatar.src} alt={avatar.tooltip} />
                  <AvatarFallback>{avatar.fallback}</AvatarFallback>
                  <AvatarGroupTooltip>{avatar.tooltip}</AvatarGroupTooltip>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-tight text-muted-foreground">
              Advisor &amp; Co-advisor
            </p>
            <AvatarGroup>
              {advisors.map((avatar, index) => (
                <Avatar key={index}>
                  <AvatarImage src={avatar.src} alt={avatar.tooltip} />
                  <AvatarFallback>{avatar.fallback}</AvatarFallback>
                  <AvatarGroupTooltip>{avatar.tooltip}</AvatarGroupTooltip>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border flex flex-col rounded-xl p-3">
        <p className="text-xs font-medium tracking-tight text-muted-foreground">
          {STUDENT_DASHBOARD_PROJECT_PROGRESS.title}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {STUDENT_DASHBOARD_PROJECT_PROGRESS.subtitle}
        </p>
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="relative w-full max-w-[280px]">
            <svg
              viewBox="0 0 100 52"
              className="h-28 w-full"
              aria-hidden="true"
            >
              <path
                d="M10 45 A40 40 0 0 1 90 45"
                className="stroke-muted opacity-30"
                strokeWidth={7}
                fill="none"
                pathLength={100}
              />
              <path
                d="M10 45 A40 40 0 0 1 90 45"
                className="stroke-primary"
                strokeWidth={7}
                fill="none"
                pathLength={100}
                strokeDasharray={`${progressPercent} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="bg-primary text-primary-foreground absolute left-1/2 top-[62%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xl">
              {STUDENT_DASHBOARD_PROJECT_PROGRESS.emoji}
            </div>
          </div>
          <div className="flex w-full max-w-[220px] justify-between text-[11px] text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
          <p className="text-2xl font-semibold tracking-tight">
            {progressPercent}%
          </p>
          <p className="text-[11px] text-muted-foreground">
            {STUDENT_DASHBOARD_PROJECT_PROGRESS.helperText}
          </p>
        </div>
      </div>

      {overviewCards.map((card) => (
        <div
          key={card.id}
          className="bg-card border border-border flex flex-col rounded-xl p-3"
        >
          <p className="text-[11px] font-medium tracking-tight text-muted-foreground">
            {card.label}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            {card.value}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {card.helperText}
          </p>
          <Button asChild size="sm" variant="ghost" className="mt-2 h-7 px-2">
            <a href={card.href}>View details</a>
          </Button>
        </div>
      ))}

      <div className="bg-card border border-border flex flex-col rounded-xl p-3">
        <p className="mb-2 text-xs font-medium tracking-tight text-muted-foreground">
          Calendar
        </p>
        <div className="flex flex-1 items-center justify-center">
          <Calendar className="w-full max-w-[220px]" />
        </div>
      </div>
    </section>
  );
}
