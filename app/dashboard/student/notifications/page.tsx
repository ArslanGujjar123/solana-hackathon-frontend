"use client";

import { useEffect, useState } from "react";
import { NotificationsHeader } from "@/components/student/notifications-header";
import { NotificationsListCard } from "@/components/student/notifications-list-card";
import { NotificationDetailDialog } from "@/components/student/notification-detail-dialog";
import { type Notification } from "@/constants/notifications";
import { tokenApi, quizApi, uploadApi } from "@/lib/api/client";

// ---------------------------------------------------------------------------
// Build notifications from real backend data
// ---------------------------------------------------------------------------

async function fetchNotifications(): Promise<Notification[]> {
  const notifications: Notification[] = [];

  try {
    // Token transaction history → COIN movement notifications
    const tokenHistory = await tokenApi.history(20, 0);
    tokenHistory.transactions.forEach((tx) => {
      const typeMap: Record<string, Notification["type"]> = {
        signup_bonus: "announcement",
        quiz_spend: "system",
        paper_spend: "system",
        upload_reward: "grade",
        send: "message",
        buy: "announcement",
      };

      const labelMap: Record<string, string> = {
        signup_bonus: "🎉 Welcome Bonus — 20 COIN credited to your wallet",
        quiz_spend: `Quiz generated — ${tx.amount} COIN spent`,
        paper_spend: `Paper generated — ${tx.amount} COIN spent`,
        upload_reward: `Upload scored — ${tx.amount} COIN earned`,
        send: `COIN sent — ${tx.amount} COIN transferred`,
        buy: `COIN purchased — ${tx.amount} COIN added`,
      };

      notifications.push({
        id: tx.id,
        type: typeMap[tx.tx_type] ?? "system",
        title: labelMap[tx.tx_type] ?? `Transaction: ${tx.tx_type}`,
        message: tx.note ?? `Amount: ${tx.amount} COIN`,
        timestamp: tx.created_at,
        isRead: true,
        from: "NextQ Platform",
      });
    });

    // Recent quiz results
    const quizHistory = await quizApi.history(5, 0);
    quizHistory.items.forEach((q) => {
      if (q.score !== null) {
        notifications.push({
          id: `quiz-${q.id}`,
          type: "grade",
          title: `Quiz result: ${q.subject}`,
          message: `You scored ${q.score}% on your ${q.subject} quiz.`,
          timestamp: q.created_at,
          isRead: true,
          from: "Quiz System",
        });
      }
    });

    // Recent upload rewards
    const uploads = await uploadApi.history(5, 0);
    uploads.forEach((u) => {
      if (u.status === "scored" && u.reward_tokens > 0) {
        notifications.push({
          id: `upload-${u.id}`,
          type: "grade",
          title: `Upload scored: ${u.filename}`,
          message: `Your upload earned ${u.reward_tokens} COIN (AI score: ${u.ai_score ?? "—"}).`,
          timestamp: u.updated_at,
          isRead: true,
          from: "AI Scoring System",
        });
      }
    });
  } catch {
    // Return whatever we have so far — partial data is fine
  }

  // Sort newest first
  return notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
      <div className="flex flex-col gap-4 pt-4">
        <NotificationsHeader unreadCount={unreadCount} />
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading notifications…</p>
        ) : (
          <NotificationsListCard
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />
        )}
      </div>

      <NotificationDetailDialog
        notification={selectedNotification}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
}
