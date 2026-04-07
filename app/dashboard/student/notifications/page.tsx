"use client";

import { useState } from "react";
import { NotificationsHeader } from "@/components/student/notifications-header";
import { NotificationsListCard } from "@/components/student/notifications-list-card";
import { NotificationDetailDialog } from "@/components/student/notification-detail-dialog";
import { MOCK_NOTIFICATIONS, Notification } from "@/constants/notifications";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Optionally mark as read when closing
    if (selectedNotification && !selectedNotification.isRead) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === selectedNotification.id ? { ...n, isRead: true } : n
        )
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <NotificationsHeader unreadCount={unreadCount} />
        <NotificationsListCard
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />
      </div>

      <NotificationDetailDialog
        notification={selectedNotification}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
}
