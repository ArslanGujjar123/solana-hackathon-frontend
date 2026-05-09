"use client";

/**
 * PaperResult — renders a structured exam paper from the AI backend.
 *
 * Handles both structured responses (MCQItem[], ShortQuestion[], LongQuestion[])
 * and raw model text responses gracefully.
 */

import { Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MCQItem, ShortQuestion, LongQuestion } from "@/lib/api/ai";

interface PaperResultProps {
  title: string;
  mcqs: MCQItem[];
  shortQuestions: ShortQuestion[];
  longQuestions: LongQuestion[];
  onRegenerate?: () => void;
  onDownload?: () => void;
}

export function PaperResult({
  title,
  mcqs,
  shortQuestions,
  longQuestions,
  onRegenerate,
  onDownload,
}: PaperResultProps) {
  const hasMcqs = mcqs.length > 0;
  const hasShort = shortQuestions.length > 0;
  const hasLong = longQuestions.length > 0;
  const isEmpty = !hasMcqs && !hasShort && !hasLong;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    // Default: build a plain-text file and download it
    const lines: string[] = [`${title}\n${"=".repeat(title.length)}\n`];

    if (hasMcqs) {
      lines.push("SECTION A — MULTIPLE CHOICE QUESTIONS\n");
      mcqs.forEach((q, i) => {
        lines.push(`${i + 1}. ${q.prompt}`);
        q.options.forEach((opt) => lines.push(`   ${opt.id}. ${opt.label}`));
        lines.push(`   Answer: ${q.answer}\n`);
      });
    }

    if (hasShort) {
      lines.push("\nSECTION B — SHORT QUESTIONS\n");
      shortQuestions.forEach((q, i) => {
        lines.push(`${i + 1}. ${q.question}\n`);
      });
    }

    if (hasLong) {
      lines.push("\nSECTION C — LONG QUESTIONS\n");
      longQuestions.forEach((q, i) => {
        lines.push(`${i + 1}. ${q.question}\n`);
      });
    }

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {/* Header */}
      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-md)] border-b border-border bg-muted/40 px-[var(--space-xl)] py-[var(--space-lg)]">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <div className="flex gap-2">
            <Button className="gap-2" size="sm" onClick={handleDownload}>
              <Download className="size-4" />
              Download
            </Button>
            {onRegenerate && (
              <Button variant="secondary" size="sm" className="gap-2" onClick={onRegenerate}>
                <RefreshCcw className="size-4" />
                Regenerate
              </Button>
            )}
          </div>
        </div>

        {isEmpty && (
          <div className="px-[var(--space-xl)] py-[var(--space-lg)]">
            <p className="text-sm text-muted-foreground">
              The AI returned an empty response. Try adjusting your query or
              selecting a different subject.
            </p>
          </div>
        )}

        {/* MCQs */}
        {hasMcqs && (
          <div className="px-[var(--space-xl)] py-[var(--space-lg)]">
            <h2 className="mb-4 border-l-4 border-primary pl-3 text-lg font-semibold text-foreground">
              Section A — Multiple Choice Questions ({mcqs.length})
            </h2>
            <div className="flex flex-col gap-5">
              {mcqs.map((q, i) => (
                <div key={q.id} className="rounded-xl border border-border bg-background p-4">
                  <p className="mb-3 font-medium text-foreground">
                    <span className="mr-2 text-primary font-bold">{i + 1}.</span>
                    {q.prompt}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                          opt.id === q.answer
                            ? "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <span className="font-semibold">{opt.id}.</span>
                        {opt.label}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Correct answer:{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {q.answer}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Short Questions */}
        {hasShort && (
          <div className="border-t border-border px-[var(--space-xl)] py-[var(--space-lg)]">
            <h2 className="mb-4 border-l-4 border-accent pl-3 text-lg font-semibold text-foreground">
              Section B — Short Questions ({shortQuestions.length})
            </h2>
            <ol className="flex flex-col gap-3">
              {shortQuestions.map((q, i) => (
                <li key={q.id} className="flex gap-3 text-sm text-foreground">
                  <span className="shrink-0 font-bold text-primary">{i + 1}.</span>
                  <span>{q.question}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Long Questions */}
        {hasLong && (
          <div className="border-t border-border px-[var(--space-xl)] py-[var(--space-lg)]">
            <h2 className="mb-4 border-l-4 border-chart-4 pl-3 text-lg font-semibold text-foreground">
              Section C — Long Questions ({longQuestions.length})
            </h2>
            <ol className="flex flex-col gap-3">
              {longQuestions.map((q, i) => (
                <li key={q.id} className="flex gap-3 text-sm text-foreground">
                  <span className="shrink-0 font-bold text-primary">{i + 1}.</span>
                  <span>{q.question}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
