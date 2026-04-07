"use client";

import { Bell } from "lucide-react";

interface NotificationsHeaderProps {
  unreadCount: number;
}

export function NotificationsHeader({ unreadCount }: NotificationsHeaderProps) {
  return (
    <div className="mb-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
        Announcements & Updates
      </p>
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold">
            {unreadCount}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Stay updated with announcements, deadlines, and important messages from your
        advisors and the FYP coordination office.
      </p>
    </div>
  );
}
