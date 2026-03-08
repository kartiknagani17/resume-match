"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav } from "@/components/Nav";
import { UploadZone } from "@/components/UploadZone";
import { AlignmentScoreRing } from "@/components/AlignmentScoreRing";
import { KeywordCards } from "@/components/KeywordCards";

interface AnalysisResult {
  alignmentScore: number;
  explanation: string;
  keywords: Array<{ keyword: string; tip: string }>;
}

/* ─── Skeleton ──────────────────────────────────────── */
function ResultSkeleton() {
  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="w-28 h-4 skeleton" />
        <div className="w-20 h-4 skeleton" />
      </div>
      <div className="flex justify-center py-4">
        <div className="w-48 h-48 rounded-full skeleton" />
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 skeleton" />
        <div className="w-5/6 h-3 skeleton" />
        <div className="w-4/5 h-3 skeleton" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-2">
            <div className="w-20 h-4 skeleton" />
            <div className="w-full h-3 skeleton" />
            <div className="w-3/4 h-3 skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[380px] p-8 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-surface-muted border border-border flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" className="w-9 h-9">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-text-primary text-base">Results will appear here</p>
        <p className="text-text-muted text-sm mt-1 max-w-[240px]">
          Fill in the form on the left and click "Get alignment score".
        </p>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) { setError("Please upload your resume."); return; }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setError("Please enter a job description (at least 50 characters).");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("resume", file);
      fd.set("jobDescription", jobDescription.trim());
      const res  = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!result) return;
    setExporting(true);
    try {
      const res = await fetch("/api/export-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = `alignment-report-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-white pt-16">
        {/* Page header strip */}
        <div className="border-b border-border bg-surface-muted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-blue">AI Analysis</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-primary">
                Analyze Resume vs Job
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Upload your resume and paste the job description — get your fit score in seconds.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Two-column content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-start">

            {/* ─── LEFT: Form ──────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Upload */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Your resume
                  </label>
                  <UploadZone
                    id="analyze-resume"
                    label="Drop your resume here"
                    onFile={setFile}
                    file={file}
                  />
                </div>

                {/* Job description */}
                <div>
                  <label htmlFor="jd" className="block text-sm font-semibold text-text-primary mb-2">
                    Job description
                  </label>
                  <textarea
                    id="jd"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here — requirements, responsibilities, required skills…"
                    rows={9}
                    className="field w-full px-4 py-3 text-sm resize-none"
                  />
                  {jobDescription.length > 0 && (
                    <p className="text-xs text-text-muted mt-1 text-right">
                      {jobDescription.length} characters
                    </p>
                  )}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="error-block"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 9a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm.75-5.5v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 1.5 0Z" />
                      </svg>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                      </svg>
                      Analyzing…
                    </>
                  ) : (
                    <>
                      Get alignment score
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06L10.44 8.75H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* ─── RIGHT: Results panel ────────────── */}
            <motion.div
              className="rounded-2xl border border-border bg-white overflow-hidden"
              style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.03), 0 2px 16px rgba(0,0,0,0.06)" }}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {/* Skeleton */}
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ResultSkeleton />
                  </motion.div>
                )}

                {/* Results */}
                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                        Analysis Results
                      </span>
                      <button
                        type="button"
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-secondary hover:text-accent hover:border-accent-mid transition-colors bg-white"
                      >
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M8 0a.75.75 0 0 1 .75.75v8.69l2.97-2.97a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.22 7.53a.75.75 0 0 1 1.06-1.06L7.25 9.44V.75A.75.75 0 0 1 8 0ZM1.5 13.25a.75.75 0 0 0 0 1.5h13a.75.75 0 0 0 0-1.5h-13Z" />
                        </svg>
                        {exporting ? "Exporting…" : "Download report"}
                      </button>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col gap-7">
                      {/* Score ring */}
                      <div className="flex justify-center">
                        <AlignmentScoreRing score={result.alignmentScore} />
                      </div>

                      {/* Explanation */}
                      <div className="rounded-xl border border-border bg-surface-muted p-4">
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {result.explanation}
                        </p>
                      </div>

                      {/* Keywords */}
                      {result.keywords.length > 0 && (
                        <div>
                          <p className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider mb-4">
                            Keywords to add
                          </p>
                          <KeywordCards keywords={result.keywords} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Empty */}
                {!result && !loading && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EmptyState />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
