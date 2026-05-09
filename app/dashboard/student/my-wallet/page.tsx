"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authContext";
import { useSolanaTransaction } from "@/hooks/use-solana-transaction";
import {
  tokenApi,
  type Transaction,
  type TokenTransfer,
} from "@/lib/api/client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CREDIT_TYPES = new Set(["signup_bonus", "upload_reward", "buy"]);

const TX_LABEL: Record<string, string> = {
  signup_bonus: "Signup Bonus",
  quiz_spend: "Quiz (Verified)",
  paper_spend: "Paper (Verified)",
  unverified_paper_spend: "Paper (Community)",
  upload_reward: "Upload Reward",
  send: "Sent",
  transfer_fee: "Transfer Fee",
  buy: "Purchase",
};

const PAGE_SIZE = 10;
type FilterType = "all" | "credits" | "debits";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudentWalletPage() {
  const {
    user,
    walletAddress,
    refreshBalance,
    setBalance: setContextBalance,
  } = useAuth();
  const { transferCoins } = useSolanaTransaction();

  // Local balance state (synced from API on load)
  const [localBalance, setLocalBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // Transaction history
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transfers, setTransfers] = useState<TokenTransfer[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [hasMore, setHasMore] = useState(false);

  // Send form
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  // Copy address
  const [copied, setCopied] = useState(false);

  // -------------------------------------------------------------------------
  // Load balance on mount + poll every 10s so received transfers appear
  // without a page reload (recipient side)
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const fetchBalance = () => {
      tokenApi
        .balance()
        .then((r) => {
          if (!cancelled) {
            setLocalBalance(r.balance);
            setContextBalance(r.balance); // keep header chip in sync
          }
        })
        .catch(() => {})
        .finally(() => { if (!cancelled) setBalanceLoading(false); });
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Load history
  // -------------------------------------------------------------------------
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const offset = page * PAGE_SIZE;
      const res = await tokenApi.history(PAGE_SIZE + 1, offset);
      const txs = res.transactions.slice(0, PAGE_SIZE);
      setHasMore(res.transactions.length > PAGE_SIZE);
      setTransactions(txs);
      setTransfers(res.sends_and_receives);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // -------------------------------------------------------------------------
  // Filtered transactions
  // -------------------------------------------------------------------------
  const filteredTxs = transactions.filter((tx) => {
    if (filter === "credits") return CREDIT_TYPES.has(tx.tx_type);
    if (filter === "debits") return !CREDIT_TYPES.has(tx.tx_type);
    return true;
  });

  // -------------------------------------------------------------------------
  // Copy wallet address
  // -------------------------------------------------------------------------
  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // -------------------------------------------------------------------------
  // Send COIN — real on-chain SPL transfer via Phantom
  //
  // Flow:
  //   1. Backend ensures recipient ATA exists (pays rent if needed)
  //   2. Frontend builds transfer tx with confirmed blockhash
  //   3. Phantom signs (user approves)
  //   4. Backend submits to Solana RPC + updates DB balances
  //
  // Falls back to custodial server-side transfer if Phantom is unavailable.
  // -------------------------------------------------------------------------
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSendSuccess(null);

    const amt = parseInt(amount, 10);
    if (!recipient.trim() || isNaN(amt) || amt <= 0) {
      setSendError("Enter a valid recipient wallet address and a positive amount.");
      return;
    }

    const currentBal = localBalance ?? user?.balance ?? 0;
    if (amt > currentBal) {
      setSendError(
        `Insufficient balance. You have ${currentBal} COIN but need ${amt}.`
      );
      return;
    }

    setSending(true);
    try {
      let newBalance: number;

      try {
        // Attempt real on-chain SPL transfer (Phantom signs).
        // Backend pre-creates recipient ATA if needed so Phantom simulation passes.
        const result = await transferCoins(recipient.trim(), amt);
        newBalance = result.new_balance;
      } catch (phantomErr) {
        // Fall back to custodial server-side transfer if Phantom is unavailable
        // or the user rejected the popup.
        const msg = phantomErr instanceof Error ? phantomErr.message : "";
        if (msg.toLowerCase().includes("user rejected") || msg.toLowerCase().includes("cancelled")) {
          throw phantomErr; // User explicitly cancelled — don't silently fall back
        }
        await tokenApi.send({ recipient_wallet: recipient.trim(), amount: amt });
        const balRes = await tokenApi.balance();
        newBalance = balRes.balance;
      }

      // Instantly update balance everywhere — no page refresh needed
      setLocalBalance(newBalance);
      setContextBalance(newBalance);

      setSendSuccess(`✓ Sent ${amt} COIN to ${recipient.slice(0, 8)}…`);
      setRecipient("");
      setAmount("");

      // Reload history to show the new transaction
      setPage(0);
      await loadHistory();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setSending(false);
    }
  };

  const displayBalance = balanceLoading ? null : (localBalance ?? user?.balance ?? 0);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-[var(--space-lg)] pt-4">
      <h1 className="text-3xl font-semibold text-foreground">My Wallet</h1>

      {/* Balance card */}
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-[var(--space-xl)] shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
          COIN Balance
        </p>
        <p className="mt-1 text-5xl font-bold text-primary">
          {displayBalance === null ? "…" : displayBalance}
        </p>

        {walletAddress && (
          <div className="mt-4 flex items-center gap-2">
            <p className="break-all font-mono text-xs text-muted-foreground">
              {walletAddress}
            </p>
            <button
              onClick={handleCopy}
              className="shrink-0 text-muted-foreground transition hover:text-foreground"
              aria-label="Copy wallet address"
            >
              {copied ? (
                <CheckCheck className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <ArrowDownLeft className="size-3.5" />
            <span>
              Credits:{" "}
              <strong>
                {transactions
                  .filter((t) => CREDIT_TYPES.has(t.tx_type))
                  .reduce((s, t) => s + t.amount, 0)}{" "}
                COIN
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <ArrowUpRight className="size-3.5" />
            <span>
              Debits:{" "}
              <strong>
                {transactions
                  .filter((t) => !CREDIT_TYPES.has(t.tx_type))
                  .reduce((s, t) => s + t.amount, 0)}{" "}
                COIN
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* Send COIN */}
      <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-foreground">Send COIN</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          The recipient receives the exact amount you send. Phantom will ask you to sign the transaction.
        </p>
        <form onSubmit={handleSend} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Recipient Wallet Address
              </label>
              <Input
                placeholder="Paste Solana wallet address…"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Amount (COIN)
              </label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {sendError && <p className="text-sm text-destructive">{sendError}</p>}
          {sendSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">{sendSuccess}</p>
          )}

          <Button type="submit" disabled={sending} className="gap-2 self-start">
            <Send className="size-4" />
            {sending ? "Waiting for Phantom…" : "Send COIN"}
          </Button>
        </form>
      </section>

      {/* Transaction history */}
      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-[var(--space-xl)] py-[var(--space-md)]">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value as FilterType); setPage(0); }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All</option>
            <option value="credits">Credits only</option>
            <option value="debits">Debits only</option>
          </select>
        </div>

        {historyLoading ? (
          <p className="px-[var(--space-xl)] py-[var(--space-lg)] text-sm text-muted-foreground">Loading…</p>
        ) : historyError ? (
          <p className="px-[var(--space-xl)] py-[var(--space-lg)] text-sm text-destructive">{historyError}</p>
        ) : filteredTxs.length === 0 ? (
          <p className="px-[var(--space-xl)] py-[var(--space-lg)] text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {filteredTxs.map((tx) => {
              const isCredit = CREDIT_TYPES.has(tx.tx_type);
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3 px-[var(--space-xl)] py-3 transition hover:bg-muted/40">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${isCredit ? "bg-green-500/10" : "bg-destructive/10"}`}>
                      {isCredit
                        ? <ArrowDownLeft className="size-4 text-green-500" />
                        : <ArrowUpRight className="size-4 text-destructive" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {TX_LABEL[tx.tx_type] ?? tx.tx_type}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {tx.note ?? new Date(tx.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className={`text-sm font-semibold tabular-nums ${isCredit ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {isCredit ? "+" : "−"}{tx.amount} COIN
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!historyLoading && (transactions.length > 0 || page > 0) && (
          <div className="flex items-center justify-between border-t border-border px-[var(--space-xl)] py-[var(--space-md)]">
            <p className="text-xs text-muted-foreground">Page {page + 1}</p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))} className="gap-1">
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)} className="gap-1">
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Peer transfers */}
      {transfers.length > 0 && (
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <h2 className="border-b border-border px-[var(--space-xl)] py-[var(--space-md)] text-lg font-semibold text-foreground">
            Peer Transfers
          </h2>
          <div className="divide-y divide-border">
            {transfers.map((t) => {
              const isSender = t.sender_user_id === user?.id;
              const counterparty = isSender
                ? `${t.recipient_user_id.slice(0, 8)}…`
                : `${t.sender_user_id.slice(0, 8)}…`;
              return (
                <div key={t.id} className="flex items-center justify-between gap-3 px-[var(--space-xl)] py-3 transition hover:bg-muted/40">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${isSender ? "bg-destructive/10" : "bg-green-500/10"}`}>
                      {isSender
                        ? <ArrowUpRight className="size-4 text-destructive" />
                        : <ArrowDownLeft className="size-4 text-green-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {isSender ? "Sent" : "Received"}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {isSender ? "To: " : "From: "}{counterparty}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className={`text-sm font-semibold tabular-nums ${isSender ? "text-destructive" : "text-green-600 dark:text-green-400"}`}>
                      {isSender ? "−" : "+"}{t.amount} COIN
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(t.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
