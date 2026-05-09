"use client";

/**
 * Upload Paper (Unverified / Community)
 *
 * Uploads a PDF/DOCX/TXT to the community vector store.
 * The AI validates the content, scores uniqueness (0.00–2.00), and
 * returns whether the paper was accepted.
 *
 * API: POST /unverified/upload-paper (multipart/form-data)
 * Fields: file, country, class, subject
 *
 * Users can select from existing classes/subjects (fetched from
 * GET /unverified/classes) or type their own.
 */

import { useEffect, useRef, useState, useMemo } from "react";
import {
  CheckCircle2,
  Globe,
  Plus,
  UploadCloud,
  XCircle,
} from "lucide-react";

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
import {
  unverifiedApi,
  type ClassEntry,
  type UnverifiedUploadResponse,
} from "@/lib/api/ai";
import { useAuth } from "@/contexts/authContext";

// ---------------------------------------------------------------------------
// World countries list
// ---------------------------------------------------------------------------
const WORLD_COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria",
  "Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia",
  "Czech Republic","Denmark","Egypt","Ethiopia","Finland","France",
  "Germany","Ghana","Greece","Hungary","India","Indonesia","Iran",
  "Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya","Malaysia",
  "Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway",
  "Pakistan","Peru","Philippines","Poland","Portugal","Romania","Russia",
  "Saudi Arabia","South Africa","South Korea","Spain","Sri Lanka","Sudan",
  "Sweden","Switzerland","Syria","Tanzania","Thailand","Turkey","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","United States",
  "Venezuela","Vietnam","Yemen","Zimbabwe",
].sort();

const CUSTOM_VALUE = "__custom__";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_EXT = ".pdf,.docx,.txt";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UploadPaperUnverifiedPage() {
  // Dynamic data
  const [classEntries, setClassEntries] = useState<ClassEntry[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const { refreshBalance } = useAuth();

  // Form state
  const [country, setCountry] = useState("");
  const [className, setClassName] = useState("");
  const [customClass, setCustomClass] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UnverifiedUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // Fetch classes
  // -------------------------------------------------------------------------
  useEffect(() => {
    unverifiedApi
      .getClasses()
      .then((res) => setClassEntries(res.classes))
      .catch(() => {}) // silently fail — user can still type manually
      .finally(() => setClassesLoading(false));
  }, []);

  // -------------------------------------------------------------------------
  // Derived options
  // -------------------------------------------------------------------------
  const availableClasses = useMemo(() => {
    if (!country) return [];
    const entries = classEntries.filter(
      (e) => e.country.toLowerCase() === country.toLowerCase()
    );
    return [...new Set(entries.map((e) => e.class_name))].sort();
  }, [classEntries, country]);

  const availableSubjects = useMemo(() => {
    const effectiveClass = className === CUSTOM_VALUE ? customClass : className;
    if (!country || !effectiveClass) return [];
    const entries = classEntries.filter(
      (e) =>
        e.country.toLowerCase() === country.toLowerCase() &&
        e.class_name.toLowerCase() === effectiveClass.toLowerCase()
    );
    return [...new Set(entries.flatMap((e) => e.subjects))].sort();
  }, [classEntries, country, className, customClass]);

  const effectiveClass =
    className === CUSTOM_VALUE ? customClass.trim() : className;
  const effectiveSubject =
    subject === CUSTOM_VALUE ? customSubject.trim() : subject;

  const isValid =
    file !== null &&
    country &&
    effectiveClass.length >= 1 &&
    effectiveSubject.length >= 1;

  // -------------------------------------------------------------------------
  // File handling
  // -------------------------------------------------------------------------
  const handleFileSelect = (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.match(/\.(pdf|docx|txt)$/i)) {
      setError("Only PDF, DOCX, and TXT files are accepted.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("File must be smaller than 20 MB.");
      return;
    }
    setError(null);
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  // -------------------------------------------------------------------------
  // Upload
  // -------------------------------------------------------------------------
  const handleUpload = async () => {
    if (!isValid || !file) return;
    setError(null);
    setResult(null);
    setUploading(true);
    try {
      const res = await unverifiedApi.uploadPaper(
        file,
        country,
        effectiveClass,
        effectiveSubject
      );
      setResult(res);
      // If accepted and score > 0, COIN was minted — refresh balance
      if (res.accepted && res.score > 0) {
        await refreshBalance();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-[var(--space-lg)] pt-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Upload Community Paper
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your exam papers with the community. The AI validates content
          and scores uniqueness (0.00–2.00). Accepted papers are added to the
          community question bank.
        </p>
      </div>

      {/* Result banner */}
      {result && (
        <div
          className={`flex flex-wrap items-start gap-4 rounded-2xl border p-5 ${
            result.accepted
              ? "border-green-300 bg-green-50 dark:bg-green-900/20"
              : "border-red-300 bg-red-50 dark:bg-red-900/20"
          }`}
        >
          {result.accepted ? (
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="mt-0.5 size-6 shrink-0 text-red-600 dark:text-red-400" />
          )}
          <div className="flex-1">
            <p
              className={`font-semibold ${
                result.accepted
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-300"
              }`}
            >
              {result.accepted
                ? `Paper accepted! +${Math.floor(result.score)} COIN earned`
                : "Paper rejected"}
            </p>
            <p
              className={`mt-1 text-sm ${
                result.accepted
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {result.reason}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Uniqueness score:
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  result.score >= 1.5
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : result.score >= 0.8
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {result.score.toFixed(2)} / 2.00
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Upload another
          </Button>
        </div>
      )}

      {/* Form */}
      <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">

          {/* Country */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label className="flex items-center gap-1.5">
              <Globe className="size-3.5 text-muted-foreground" />
              Country <span className="text-destructive">*</span>
            </Label>
            <Select
              value={country}
              onValueChange={(v) => {
                setCountry(v);
                setClassName("");
                setCustomClass("");
                setSubject("");
                setCustomSubject("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country…" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {WORLD_COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Class / Level <span className="text-destructive">*</span>
            </Label>
            {classesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <Select
                  value={className}
                  onValueChange={(v) => {
                    setClassName(v);
                    setSubject("");
                    setCustomSubject("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        availableClasses.length > 0
                          ? "Select class…"
                          : "Type your class below"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_VALUE}>
                      <span className="flex items-center gap-1.5">
                        <Plus className="size-3.5" /> Add new class…
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {(className === CUSTOM_VALUE ||
                  availableClasses.length === 0) && (
                  <Input
                    placeholder='e.g. "O Level", "Class 10", "Grade 11"'
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    className="mt-1"
                  />
                )}
              </>
            )}
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Subject <span className="text-destructive">*</span>
            </Label>
            {classesLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <Select
                  value={subject}
                  onValueChange={setSubject}
                  disabled={!effectiveClass}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        availableSubjects.length > 0
                          ? "Select subject…"
                          : "Type your subject below"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_VALUE}>
                      <span className="flex items-center gap-1.5">
                        <Plus className="size-3.5" /> Add new subject…
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {(subject === CUSTOM_VALUE ||
                  availableSubjects.length === 0) && (
                  <Input
                    placeholder='e.g. "Biology", "Business Studies"'
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="mt-1"
                  />
                )}
              </>
            )}
          </div>

          {/* File drop zone */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label>
              Paper File (PDF / DOCX / TXT){" "}
              <span className="text-destructive">*</span>
            </Label>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition ${
                dragOver
                  ? "border-primary bg-primary/10"
                  : file
                  ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <UploadCloud
                className={`mb-3 size-10 transition ${
                  file ? "text-green-500" : "text-primary/60"
                }`}
              />
              {file ? (
                <>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB — click to change
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-foreground">
                    Drag & drop or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, DOCX, TXT — max 20 MB
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXT}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">How scoring works</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            <li>Score 1.50–2.00 → Highly unique, accepted immediately</li>
            <li>Score 0.80–1.49 → Moderately unique, accepted</li>
            <li>Score below 0.80 → Too similar to existing content, rejected</li>
          </ul>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button
            disabled={!isValid || uploading}
            onClick={handleUpload}
            className="gap-2 px-8"
          >
            {uploading ? (
              <>
                <UploadCloud className="size-4 animate-bounce" />
                Uploading & Validating…
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                Upload Paper
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}
