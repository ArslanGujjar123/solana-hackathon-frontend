"use client";

import { X, Clock, User, Bell } from "lucide-react";
import {
  Notification,
  NOTIFICATION_TYPE_CONFIG,
} from "@/constants/notifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotificationDetailDialogProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDetailDialog({
  notification,
  isOpen,
  onClose,
}: NotificationDetailDialogProps) {
  if (!isOpen || !notification) return null;

  const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center",
                  typeConfig.bgColor
                )}
              >
                <Bell className={cn("h-4 w-4", typeConfig.color)} />
              </div>
              <div>
                <span
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wide",
                    typeConfig.color
                  )}
                >
                  {typeConfig.label}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {/* Title */}
            <h2 className="text-base font-bold text-foreground mb-3">
              {notification.title}
            </h2>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mb-4 pb-4 border-b border-border">
              {notification.from && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span className="font-medium">{notification.from}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatTimestamp(notification.timestamp)}
              </span>
            </div>

            {/* Full Content */}
            <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {notification.fullContent || notification.message}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border flex justify-end gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              Close
            </Button>
            <Button size="sm" onClick={onClose} className="h-8 text-xs">
              Mark as Read
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
