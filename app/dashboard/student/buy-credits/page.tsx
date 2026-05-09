"use client";

/**
 * Buy Credits page — Step 7
 *
 * Wires up POST /api/token/buy.
 * After a successful purchase the auth context balance is refreshed so the
 * top-nav COIN chip updates immediately without a page reload.
 */

import { useState } from "react";
import { ExternalLink, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import { tokenApi } from "@/lib/api/client";
import { useAuth } from "@/contexts/authContext";

// ---------------------------------------------------------------------------
// Package definitions — 5 COIN per $1 USD (matches backend rate)
// ---------------------------------------------------------------------------

const PACKAGES = [
  { id: 1, name: "Starter",  usd: 1,  coins: 5,   description: "Try it out" },
  { id: 2, name: "Basic",    usd: 5,  coins: 25,  description: "A few quizzes" },
  { id: 3, name: "Standard", usd: 10, coins: 50,  description: "Most popular" },
  { id: 4, name: "Pro",      usd: 20, coins: 100, description: "Power user" },
  { id: 5, name: "Max",      usd: 50, coins: 250, description: "Best value" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentBuyCreditsPage() {
  const { refreshBalance } = useAuth();

  const [loading, setLoading] = useState<number | null>(null);
  const [result, setResult] = useState<{
    checkoutUrl: string;
    credited: number;
    pkgName: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async (usd: number, pkgId: number, pkgName: string) => {
    setError(null);
    setResult(null);
    setLoading(pkgId);
    try {
      const res = await tokenApi.buy(usd);

      // Refresh the balance in auth context so the top-nav chip updates
      await refreshBalance();

      setResult({
        checkoutUrl: res.checkout_url,
        credited: res.credited_tokens,
        pkgName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-[var(--space-lg)] pt-4">
      <h1 className="text-3xl font-semibold text-foreground">Buy COIN</h1>

      {/* How it works */}
      <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">How it works</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a package. COIN is credited to your account immediately.
          Rate: <strong className="text-foreground">5 COIN per $1 USD</strong>.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PayPal integration is in placeholder mode — COIN is credited
          instantly for testing. Full PayPal capture coming in the next
          iteration.
        </p>
      </section>

      {/* Success banner */}
      {result && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-300 bg-green-50 px-4 py-3 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <Coins className="size-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                {result.credited} COIN credited — {result.pkgName} package
              </p>
              <p className="text-xs text-green-700 dark:text-green-400">
                Complete payment via PayPal to finalise.
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="secondary" className="gap-1 shrink-0">
            <a href={result.checkoutUrl} target="_blank" rel="noopener noreferrer">
              Open PayPal <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Packages grid */}
      <section className="grid gap-[var(--space-md)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PACKAGES.map((pkg) => (
          <article
            key={pkg.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-[var(--space-lg)] shadow-sm transition hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {pkg.name}
              </p>
              <p className="mt-1 text-3xl font-bold text-primary">
                {pkg.coins}
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  COIN
                </span>
              </p>
              <p className="text-sm text-muted-foreground">${pkg.usd} USD</p>
            </div>
            <p className="flex-1 text-xs text-muted-foreground">
              {pkg.description}
            </p>
            <Button
              size="sm"
              className="w-full"
              disabled={loading === pkg.id}
              onClick={() => handleBuy(pkg.usd, pkg.id, pkg.name)}
            >
              {loading === pkg.id ? "Processing…" : "Buy"}
            </Button>
          </article>
        ))}
      </section>

      {/* Table view (alternative) */}
      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-[var(--space-xl)] py-[var(--space-md)]">
          <h2 className="text-base font-semibold text-foreground">
            All Packages
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
              <tr className="border-b border-border">
                {["#", "Package", "Price (USD)", "COIN", "Action"].map(
                  (col) => (
                    <th
                      key={col}
                      className={`px-[var(--space-lg)] py-[var(--space-md)] ${
                        col === "Action" ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="transition hover:bg-muted/40">
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground">
                    {pkg.id}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground">
                    {pkg.name}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground">
                    ${pkg.usd}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-semibold text-primary">
                    {pkg.coins} COIN
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-right">
                    <Button
                      size="sm"
                      disabled={loading === pkg.id}
                      onClick={() => handleBuy(pkg.usd, pkg.id, pkg.name)}
                    >
                      {loading === pkg.id ? "Processing…" : "Buy"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
