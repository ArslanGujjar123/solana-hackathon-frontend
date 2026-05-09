"use client";

/**
 * Unverified Paper Generation
 *
 * Uses community-uploaded papers from the unverified vector store.
 * Classes/subjects are fetched dynamically from GET /unverified/classes.
 * Only shows options that exist in the API data — no manual text entry.
 *
 * API: POST /unverified/generate-paper
 * Body: { country, class, subject, mcqs, short_questions, long_questions, query }
 */

import { useEffect, useState, useMemo } from "react";
import { Globe, Loader2 } from "lucide-react";

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
import {
  unverifiedApi,
  type ClassEntry,
  type PaperResponse,
} from "@/lib/api/ai";
import { useAuth } from "@/contexts/authContext";
import { useSolanaTransaction } from "@/hooks/use-solana-transaction";
import { paperApi } from "@/lib/api/client";

type Step = "form" | "loading" | "result";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UnverifiedRankPapersPage() {
  const [classEntries, setClassEntries] = useState<ClassEntry[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);
  const { refreshBalance, setBalance: setContextBalance } = useAuth();
  const { burnCoins } = useSolanaTransaction();

  // Form state — only values from API data
  const [country, setCountry] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [mcqs, setMcqs] = useState(10);
  const [shortQ, setShortQ] = useState(5);
  const [longQ, setLongQ] = useState(3);
  const [query, setQuery] = useState("");

  const [step, setStep] = useState<Step>("form");
  const [paper, setPaper] = useState<PaperResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Fetch available classes on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    unverifiedApi
      .getClasses()
      .then((res) => setClassEntries(res.classes))
      .catch((err) =>
        setClassesError(err instanceof Error ? err.message : "Failed to load classes")
      )
      .finally(() => setClassesLoading(false));
  }, []);

  // -------------------------------------------------------------------------
  // Derived options — only what the API has data for
  // -------------------------------------------------------------------------

  const availableCountries = useMemo(() => {
    return [...new Set(classEntries.map((e) => e.country))].sort();
  }, [classEntries]);

  const availableClasses = useMemo(() => {
    if (!country) return [];
    return [
      ...new Set(
        classEntries
          .filter((e) => e.country.toLowerCase() === country.toLowerCase())
          .map((e) => e.class_name)
      ),
    ].sort();
  }, [classEntries, country]);

  const availableSubjects = useMemo(() => {
    if (!country || !className) return [];
    return [
      ...new Set(
        classEntries
          .filter(
            (e) =>
              e.country.toLowerCase() === country.toLowerCase() &&
              e.class_name.toLowerCase() === className.toLowerCase()
          )
          .flatMap((e) => e.subjects)
      ),
    ].sort();
  }, [classEntries, country, className]);

  const isValid =
    country &&
    className.length >= 1 &&
    subject.length >= 1 &&
    query.trim().length >= 3;

  // -------------------------------------------------------------------------
  // Generate paper
  // -------------------------------------------------------------------------
  const handleGenerate = async () => {
    if (!isValid) return;
    setError(null);
    setStep("loading");
    try {
      // Step 1 — Burn 2 COIN on-chain via Phantom (real SPL burn).
      try {
        const burnResult = await burnCoins(2, "unverified_paper_spend");
        setContextBalance(burnResult.new_balance);
        try { await paperApi.recordUnverified(subject, 2); } catch { /* continue */ }
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
        await paperApi.generateUnverified(subject);
        refreshBalance().catch(() => {});
      }

      // Step 2 — Generate paper content from AI
      const result = await unverifiedApi.generatePaper({
        country,
        class: className,
        subject,
        mcqs,
        short_questions: shortQ,
        long_questions: longQ,
        query: query.trim(),
      });
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
            The AI is searching community-uploaded papers. This may take 15–40 seconds.
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
          title={`Community Paper — ${subject} (${className}, ${country})`}
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
          Generate Community Paper
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-generated papers from community-uploaded exam content.
          Select from the available options below.
        </p>
      </div>

      {classesError && (
        <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
          Could not load available options ({classesError}). Please try again later.
        </div>
      )}

      <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">

          {/* Country — from API data */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="flex items-center gap-1.5">
              <Globe className="size-3.5 text-muted-foreground" />
              Country <span className="text-destructive">*</span>
            </Label>
            {classesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={country}
                onValueChange={(v) => {
                  setCountry(v);
                  setClassName("");
                  setSubject("");
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      availableCountries.length > 0
                        ? "Select country…"
                        : "No data available"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableCountries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Class — from API data for selected country */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Class / Level <span className="text-destructive">*</span>
            </Label>
            {classesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={className}
                disabled={!country || availableClasses.length === 0}
                onValueChange={(v) => {
                  setClassName(v);
                  setSubject("");
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !country
                        ? "Select country first"
                        : availableClasses.length > 0
                        ? "Select class…"
                        : "No classes available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Subject — from API data for selected country + class */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Subject <span className="text-destructive">*</span>
            </Label>
            {classesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={subject}
                disabled={!className || availableSubjects.length === 0}
                onValueChange={setSubject}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !className
                        ? "Select class first"
                        : availableSubjects.length > 0
                        ? "Select subject…"
                        : "No subjects available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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

          {/* Query */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Focus / Difficulty{" "}
              <span className="text-xs text-muted-foreground">(min 3 chars)</span>{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder='e.g. "famous, easy" or "chapter 3, hard"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Papers are generated from community uploads. Quality may vary.
          </p>
          <Button
            disabled={!isValid}
            onClick={handleGenerate}
            className="gap-2 px-8"
          >
            <Loader2 className="hidden size-4" />
            Generate Paper (−2 COIN)
          </Button>
        </div>
      </section>
    </div>
  );
}
