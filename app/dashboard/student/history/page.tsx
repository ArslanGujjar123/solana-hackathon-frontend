"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quizApi, paperApi, type GeneratedQuiz, type GeneratedPaper } from "@/lib/api/client";

// ---------------------------------------------------------------------------
// Unified history item
// ---------------------------------------------------------------------------

type HistoryItem =
  | { kind: "quiz"; id: string; subject: string; score: number | null; tokens_spent: number; created_at: string }
  | { kind: "paper"; id: string; subject: string; download_url: string | null; tokens_spent: number; created_at: string };

const TYPE_BADGE: Record<"quiz" | "paper", string> = {
  quiz: "bg-primary/10 text-primary",
  paper: "bg-accent/10 text-accent",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [quizRes, paperRes] = await Promise.all([
          quizApi.history(50, 0),
          paperApi.history(50, 0),
        ]);

        const quizItems: HistoryItem[] = quizRes.items.map((q: GeneratedQuiz) => ({
          kind: "quiz",
          id: q.id,
          subject: q.subject,
          score: q.score,
          tokens_spent: q.tokens_spent,
          created_at: q.created_at,
        }));

        const paperItems: HistoryItem[] = paperRes.items.map((p: GeneratedPaper) => ({
          kind: "paper",
          id: p.id,
          subject: p.subject,
          download_url: p.download_url,
          tokens_spent: p.tokens_spent,
          created_at: p.created_at,
        }));

        // Merge and sort newest first
        const merged = [...quizItems, ...paperItems].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setItems(merged);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.subject.toLowerCase().includes(q));
  }, [items, query]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;

  return (
    <div className="flex flex-col gap-[var(--space-lg)] pt-4">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)]">
        <h1 className="text-3xl font-semibold text-foreground">History</h1>
        <div className="w-full max-w-[320px]">
          <Input
            placeholder="Search by subject…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <p className="px-[var(--space-xl)] py-[var(--space-lg)] text-sm text-muted-foreground">
            Loading…
          </p>
        ) : filtered.length === 0 ? (
          <p className="px-[var(--space-xl)] py-[var(--space-lg)] text-sm text-muted-foreground">
            No history yet. Take a quiz or generate a paper to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
                <tr className="border-b border-border">
                  {["Type", "Subject", "Score / URL", "COIN Spent", "Date", ""].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-[var(--space-lg)] py-[var(--space-md)]"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition hover:bg-muted/40">
                    <td className="px-[var(--space-lg)] py-[var(--space-md)]">
                      <Badge className={TYPE_BADGE[item.kind]}>
                        {item.kind === "quiz" ? "Quiz" : "Paper"}
                      </Badge>
                    </td>
                    <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground">
                      {item.subject}
                    </td>
                    <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground">
                      {item.kind === "quiz"
                        ? item.score !== null
                          ? `${item.score}%`
                          : "Not submitted"
                        : item.download_url
                        ? "Available"
                        : "—"}
                    </td>
                    <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground">
                      {item.tokens_spent} COIN
                    </td>
                    <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-[var(--space-lg)] py-[var(--space-md)]">
                      {item.kind === "paper" && item.download_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-chart-2"
                          aria-label="Download paper"
                          asChild
                        >
                          <a href={item.download_url} target="_blank" rel="noopener noreferrer">
                            <Download className="size-4" />
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {items.length} records
      </p>
    </div>
  );
}
