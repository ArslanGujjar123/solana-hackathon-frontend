"use client";

/**
 * Verified Paper Generation
 * Uses curated exam data from the verified vector store.
 * Two modes: Cambridge (O/A Level) and Pakistani Boards (Class 9–12)
 */

import { useState } from "react";
import { BookOpen, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PaperResult } from "@/components/student/paper-result";
import { verifiedApi, type PaperResponse } from "@/lib/api/ai";
import { useAuth } from "@/contexts/authContext";
import { useSolanaTransaction } from "@/hooks/use-solana-transaction";
import { paperApi } from "@/lib/api/client";

// ---------------------------------------------------------------------------
// Static options
// ---------------------------------------------------------------------------

const CAMBRIDGE_CLASSES = ["O Level", "A Level", "IGCSE", "AS Level"];
const CAMBRIDGE_SUBJECTS = [
  "Biology", "Chemistry", "Physics", "Mathematics",
  "English Language", "English Literature", "History",
  "Geography", "Economics", "Business Studies",
  "Computer Science", "Accounting",
];

const BOARDS_CLASSES = [
  "Class 9", "Class 10", "Class 11 (First Year)", "Class 12 (Second Year)",
];
const BOARDS_SUBJECTS = [
  "Biology", "Chemistry", "Physics", "Mathematics",
  "English", "Urdu", "Islamiat", "Pakistan Studies",
  "Computer Science", "Economics",
];

type Mode = "cambridge" | "boards";
type Step = "form" | "loading" | "result";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VerifiedRankPapersPage() {
  const [mode, setMode] = useState<Mode>("cambridge");
  const [step, setStep] = useState<Step>("form");
  const { refreshBalance, setBalance: setContextBalance } = useAuth();
  const { burnCoins } = useSolanaTransaction();

  // Form fields
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [mcqs, setMcqs] = useState(10);
  const [shortQ, setShortQ] = useState(5);
  const [longQ, setLongQ] = useState(3);
  const [query, setQuery] = useState("");

  // Result
  const [paper, setPaper] = useState<PaperResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classes = mode === "cambridge" ? CAMBRIDGE_CLASSES : BOARDS_CLASSES;
  const subjects = mode === "cambridge" ? CAMBRIDGE_SUBJECTS : BOARDS_SUBJECTS;

  const isValid = className && subject && query.trim().length >= 3;

  const handleGenerate = async () => {
    if (!isValid) return;
    setError(null);
    setStep("loading");
    try {
      // Step 1 — Burn 5 COIN on-chain via Phantom (real SPL burn).
      // Phantom signs → backend submits to Solana RPC → DB updated.
      try {
        const burnResult = await burnCoins(5, "paper_spend");
        setContextBalance(burnResult.new_balance);

        // Record paper row in DB for history — no COIN deduction (already burned on-chain)
        try { await paperApi.record(subject, 5); } catch { /* history record failed, continue */ }
      } catch (burnErr) {
        const msg = burnErr instanceof Error ? burnErr.message : "";
        if (
          msg.toLowerCase().includes("user rejected") ||
          msg.toLowerCase().includes("cancelled") ||
          msg.toLowerCase().includes("rejected")
        ) {
          setError("Transaction cancelled.");
          setStep("form");
          return;
        }
        // Phantom unavailable — fall back to DB-only deduction
        await paperApi.generate(subject);
        refreshBalance().catch(() => {});
      }

      // Step 2 — Generate paper content from AI
      const aiReq = {
        class: className,
        subject,
        mcqs,
        short_questions: shortQ,
        long_questions: longQ,
        query: query.trim(),
      };
      const result =
        mode === "cambridge"
          ? await verifiedApi.generateCambridge(aiReq)
          : await verifiedApi.generateBoards(aiReq);
      setPaper(result);
      setStep("result");
      refreshBalance().catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate paper.";
      setError(msg);
      setStep("form");
    }
  };

  const handleRegenerate = () => {
    setPaper(null);
    setStep("form");
  };

  // -------------------------------------------------------------------------
  // Loading skeleton
  // -------------------------------------------------------------------------
  if (step === "loading") {
    return (
      <div className="flex flex-col gap-[var(--space-lg)] pt-4">
        <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
          <h1 className="mb-2 text-2xl font-semibold text-foreground">
            Generating your paper…
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            The AI is retrieving questions from the verified exam database.
            This usually takes 10–30 seconds.
          </p>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </section>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Result
  // -------------------------------------------------------------------------
  if (step === "result" && paper) {
    return (
      <div className="pt-4">
        <PaperResult
          title={`${mode === "cambridge" ? "Cambridge" : "Boards"} — ${subject} (${className})`}
          mcqs={paper.mcqs}
          shortQuestions={paper.short_questions}
          longQuestions={paper.long_questions}
          onRegenerate={handleRegenerate}
        />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Form
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-[var(--space-lg)] pt-4">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Generate Verified Paper
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-generated exam papers from curated, verified question banks.
        </p>
      </div>

      {/* Mode selector */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => { setMode("cambridge"); setClassName(""); setSubject(""); }}
          className={`flex items-center gap-3 rounded-2xl border-2 p-5 text-left transition ${
            mode === "cambridge"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40"
          }`}
        >
          <GraduationCap className={`size-6 ${mode === "cambridge" ? "text-primary" : "text-muted-foreground"}`} />
          <div>
            <p className="font-semibold text-foreground">Cambridge</p>
            <p className="text-xs text-muted-foreground">O Level, A Level, IGCSE</p>
          </div>
        </button>
        <button
          onClick={() => { setMode("boards"); setClassName(""); setSubject(""); }}
          className={`flex items-center gap-3 rounded-2xl border-2 p-5 text-left transition ${
            mode === "boards"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40"
          }`}
        >
          <BookOpen className={`size-6 ${mode === "boards" ? "text-primary" : "text-muted-foreground"}`} />
          <div>
            <p className="font-semibold text-foreground">Pakistani Boards</p>
            <p className="text-xs text-muted-foreground">FBISE, BISE Lahore, Karachi…</p>
          </div>
        </button>
      </div>

      {/* Form */}
      <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Class */}
          <div className="flex flex-col gap-1.5">
            <Label>Class / Level</Label>
            <Select value={className} onValueChange={setClassName}>
              <SelectTrigger>
                <SelectValue placeholder="Select class…" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <Label>Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject…" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MCQs */}
          <div className="flex flex-col gap-1.5">
            <Label>MCQs (1–50)</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={mcqs}
              onChange={(e) => setMcqs(Math.min(50, Math.max(1, +e.target.value)))}
            />
          </div>

          {/* Short questions */}
          <div className="flex flex-col gap-1.5">
            <Label>Short Questions (0–30)</Label>
            <Input
              type="number"
              min={0}
              max={30}
              value={shortQ}
              onChange={(e) => setShortQ(Math.min(30, Math.max(0, +e.target.value)))}
            />
          </div>

          {/* Long questions */}
          <div className="flex flex-col gap-1.5">
            <Label>Long Questions (0–20)</Label>
            <Input
              type="number"
              min={0}
              max={20}
              value={longQ}
              onChange={(e) => setLongQ(Math.min(20, Math.max(0, +e.target.value)))}
            />
          </div>

          {/* Query / focus */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Focus / Difficulty{" "}
              <span className="text-xs text-muted-foreground">(min 3 chars)</span>
            </Label>
            <Input
              placeholder='e.g. "difficult, famous" or "easy, chapter 3"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            disabled={!isValid}
            onClick={handleGenerate}
            className="gap-2 px-8"
          >
            {/* < className="size-4 hidden" /> */}
            Generate Paper (−5 COIN)
          </Button>
        </div>
      </section>
    </div>
  );
}
