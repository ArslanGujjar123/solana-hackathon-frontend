"use client";

import { useEffect, useState } from "react";
import { FileText, Gauge, ListChecks } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";
import { tokenApi, quizApi, paperApi, uploadApi } from "@/lib/api/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardStats {
  balance: number;
  quizzesTaken: number;
  papersGenerated: number;
  uploadsSubmitted: number;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentHomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [balanceRes, quizRes, paperRes, uploadRes] = await Promise.all([
          tokenApi.balance(),
          quizApi.history(1000, 0),   // fetch all to get real count
          paperApi.history(1000, 0),
          uploadApi.history(1000, 0),
        ]);

        setStats({
          balance: balanceRes.balance,
          quizzesTaken: quizRes.items.length,
          papersGenerated: paperRes.items.length,
          uploadsSubmitted: Array.isArray(uploadRes) ? uploadRes.length : 0,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      }
    };

    if (user) load();
  }, [user]);

  // Shorten wallet address
  const shortWallet = user?.wallet_address
    ? `${user.wallet_address.slice(0, 6)}…${user.wallet_address.slice(-4)}`
    : null;

  return (
    <div className="flex flex-col gap-[var(--space-lg)] pt-4">
      {/* Header */}
      <section className="flex flex-col gap-[var(--space-2xs)]">
        <h1 className="text-3xl font-semibold text-foreground">
          Welcome back 👋
        </h1>
        {shortWallet && (
          <p className="font-mono text-sm text-muted-foreground">{shortWallet}</p>
        )}
      </section>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* COIN balance hero card */}
      <section className="flex items-center justify-between rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-[var(--space-xl)] shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            COIN Balance
          </p>
          <p className="text-4xl font-bold text-primary">
            {stats ? stats.balance : user?.balance ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            Use COIN to generate quizzes &amp; papers
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild size="sm">
            <Link href="/dashboard/student/buy-credits">Buy COIN</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/dashboard/student/my-wallet">View Wallet</Link>
          </Button>
        </div>
      </section>

      {/* Stats grid */}
      <section className="grid gap-[var(--space-lg)] md:grid-cols-3">
        {[
          {
            icon: ListChecks,
            label: "Quizzes Taken",
            value: stats?.quizzesTaken ?? "—",
            href: "/dashboard/student/history",
          },
          {
            icon: FileText,
            label: "Papers Generated",
            value: stats?.papersGenerated ?? "—",
            href: "/dashboard/student/history",
          },
          {
            icon: Gauge,
            label: "Uploads Submitted",
            value: stats?.uploadsSubmitted ?? "—",
            href: "/dashboard/student/upload-paper-unverified",
          },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href}>
            <article className="flex cursor-pointer flex-col gap-[var(--space-sm)] rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm transition hover:shadow-md hover:border-primary/40">
              <div className="flex items-center gap-[var(--space-sm)] text-muted-foreground">
                <Icon className="size-5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {label}
                </p>
              </div>
              <p className="text-3xl font-semibold text-foreground">{value}</p>
            </article>
          </Link>
        ))}
      </section>

      {/* Quick actions */}
      <section className="flex flex-col gap-[var(--space-md)]">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-[var(--space-md)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Take a Quiz",
              description: "Generate max 200 MCQs with AI — costs 5 COIN",
              href: "/dashboard/student/quiz",
              cost: "−5 COIN",
            },
            {
              label: "Generate Paper",
              description: "Create a practice paper — costs 5 COIN",
              href: "/dashboard/student/rank-papers-verified",
              cost: "−5 COIN",
            },
            {
              label: "Upload Paper",
              description: "Earn COIN by uploading past papers",
              href: "/dashboard/student/upload-paper-unverified",
              cost: "+0–2 COIN",
            },
            {
              label: "Send COIN",
              description: "Transfer COIN to another student",
              href: "/dashboard/student/my-wallet",
              cost: "Transfer",
            },
          ].map(({ label, description, href, cost }) => (
            <Link key={label} href={href}>
              <article className="flex h-full cursor-pointer flex-col gap-2 rounded-2xl border border-border bg-card p-[var(--space-lg)] shadow-sm transition hover:shadow-md hover:border-primary/40">
                <p className="font-semibold text-foreground">{label}</p>
                <p className="flex-1 text-xs text-muted-foreground">{description}</p>
                <Badge variant="secondary" className="w-fit text-xs">
                  {cost}
                </Badge>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
