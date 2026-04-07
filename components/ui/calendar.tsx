"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CALENDAR_WEEKDAY_LABELS } from "@/constants/calendar";

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

type CalendarProps = {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
};

function buildMonthDays(displayMonth: Date, selected?: Date): CalendarDay[][] {
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

  const today = new Date();
  const startDate = new Date(year, month, 1 - startWeekday);

  const weeks: CalendarDay[][] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const week: CalendarDay[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + weekIndex * 7 + dayIndex);

      const isCurrentMonth = current.getMonth() === month;
      const isToday =
        current.getFullYear() === today.getFullYear() &&
        current.getMonth() === today.getMonth() &&
        current.getDate() === today.getDate();

      const isSelected =
        !!selected &&
        current.getFullYear() === selected.getFullYear() &&
        current.getMonth() === selected.getMonth() &&
        current.getDate() === selected.getDate();

      week.push({
        date: current,
        isCurrentMonth,
        isToday,
        isSelected,
      });
    }

    weeks.push(week);
  }

  return weeks;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    () => selected ?? new Date()
  );

  React.useEffect(() => {
    if (selected) {
      setDisplayMonth(selected);
    }
  }, [selected]);

  const weeks = React.useMemo(
    () => buildMonthDays(displayMonth, selected),
    [displayMonth, selected]
  );

  const monthLabel = React.useMemo(
    () =>
      displayMonth.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
    [displayMonth]
  );

  const handleDayClick = (day: CalendarDay) => {
    if (!onSelect) return;
    onSelect(day.date);
  };

  const goToPreviousMonth = () => {
    setDisplayMonth((current) => {
      const next = new Date(current);
      next.setMonth(current.getMonth() - 1);
      return next;
    });
  };

  const goToNextMonth = () => {
    setDisplayMonth((current) => {
      const next = new Date(current);
      next.setMonth(current.getMonth() + 1);
      return next;
    });
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 text-[11px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-xs font-medium text-foreground">{monthLabel}</div>
        <button
          type="button"
          onClick={goToNextMonth}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {CALENDAR_WEEKDAY_LABELS.map((label, index) => (
          <span key={`${label}-${index}`} className="font-medium">
            {label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1 text-center text-[11px]">
        {weeks.map((week, index) => (
          <div key={index} className="grid grid-cols-7 gap-1">
            {week.map((day) => {
              const isInteractive = !!onSelect;
              const isHighlighted = day.isSelected || (!selected && day.isToday);

              return (
                <button
                  key={day.date.toISOString()}
                  type="button"
                  onClick={isInteractive ? () => handleDayClick(day) : undefined}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[11px]",
                    day.isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground/50",
                    isHighlighted &&
                      "bg-primary text-primary-foreground",
                    isInteractive &&
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  )}
                  aria-current={day.isToday ? "date" : undefined}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
