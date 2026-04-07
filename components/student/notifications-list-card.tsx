"use client";

import { useState } from "react";
import { Bell, Clock, User, ChevronRight } from "lucide-react";
import {
  Notification,
  NOTIFICATION_TYPE_CONFIG,
} from "@/constants/notifications";
import { cn } from "@/lib/utils";

interface NotificationsListCardProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export function NotificationsListCard({
  notifications,
  onNotificationClick,
}: NotificationsListCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">All Notifications</h3>
        </div>
        <p className="text-[10px] text-muted-foreground">
          {notifications.length} total
        </p>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll see announcements and updates here
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type];
            return (
              <button
                key={notification.id}
                onClick={() => onNotificationClick(notification)}
                className={cn(
                  "w-full p-4 text-left hover:bg-accent/50 transition-colors relative",
                  !notification.isRead && "bg-primary/5"
                )}
              >
                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                )}

                <div className={cn("flex gap-3", !notification.isRead && "pl-3")}>
                  {/* Type Badge */}
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      typeConfig.bgColor
                    )}
                  >
                    <Bell className={cn("h-4 w-4", typeConfig.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={cn(
                          "text-xs font-semibold text-foreground line-clamp-1",
                          !notification.isRead && "font-bold"
                        )}
                      >
                        {notification.title}
                      </h4>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded",
                          typeConfig.bgColor,
                          typeConfig.color
                        )}
                      >
                        {typeConfig.label}
                      </span>
                      {notification.from && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {notification.from}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
