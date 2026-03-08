"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Nav } from "@/components/Nav";
import { UploadZone } from "@/components/UploadZone";

interface JobItem {
  id: string;
  title: string;
  company: string;
  link: string | null;
  snippet: string;
  location: string | null;
}

interface JobsResponse {
  query: string;
  jobTitle: string;
  skills: string[];
  location: string;
  jobs: JobItem[];
}

/* ─── Company avatar ─────────────────────────────────── */
const AVATAR_COLORS: [string, string][] = [
  ["#EFF6FF", "#1D4ED8"],
  ["#F0FDF4", "#15803D"],
  ["#FFFBEB", "#B45309"],
  ["#FDF2F8", "#9D174D"],
  ["#EFF6FF", "#1E40AF"],
  ["#FEF2F2", "#B91C1C"],
];

function CompanyAvatar({ name }: { name: string }) {
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const [bg, fg] = AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
      style={{ background: bg, color: fg, border: `1px solid ${fg}20` }}
    >
      {initials || "?"}
    </div>
  );
}

/* ─── Skeleton card ──────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border p-5 flex gap-4">
      <div className="w-11 h-11 rounded-xl skeleton shrink-0" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="w-1/2 h-4 skeleton" />
        <div className="w-1/3 h-3 skeleton" />
        <div className="w-2/3 h-3 skeleton" />
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<JobsResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);
    if (!file) { setError("Please upload your resume."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("resume", file);
      const res  = await fetch("/api/jobs", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Job search failed");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />

      <main className="min-h-screen bg-white pt-16">
        {/* Page header */}
        <div className="border-b border-border bg-surface-muted">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-1">
                <span className="badge badge-blue">AI-Powered Search</span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-primary">
                Find Jobs for My Resume
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                We extract your skills and role from your resume, then surface matching jobs from boards across the web.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Your resume
              </label>
              <UploadZone
                id="jobs-resume"
                label="Drop your resume here"
                onFile={setFile}
                file={file}
              />
            </div>

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

            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                  </svg>
                  Searching jobs…
                </>
              ) : (
                <>
                  Find matching jobs
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </motion.form>

          {/* Results */}
          <AnimatePresence>
            {/* Skeleton */}
            {loading && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 space-y-3"
              >
                <div className="w-36 h-4 skeleton mb-5" />
                {[0, 1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </motion.div>
            )}

            {/* Jobs */}
            {data && !loading && (
              <motion.section
                key="results"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-10"
              >
                {/* Result meta */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-text-primary">Jobs for you</h2>
                    <p className="text-text-muted text-sm mt-0.5">
                      Based on: <span className="text-text-secondary font-medium">{data.jobTitle}</span>
                      {data.skills.length > 0 && ` · ${data.skills.slice(0, 3).join(", ")}`}
                    </p>
                  </div>
                  <span className="badge badge-blue shrink-0">
                    {data.jobs.length} result{data.jobs.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Skill chips */}
                {data.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {data.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-full bg-surface-muted border border-border text-xs font-medium text-text-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* No results */}
                {data.jobs.length === 0 && (
                  <div className="rounded-xl border border-border bg-surface-muted p-10 text-center">
                    <p className="text-text-muted text-sm">
                      No jobs found. Try refining your resume or search again later.
                    </p>
                  </div>
                )}

                {/* Job list */}
                {data.jobs.length > 0 && (
                  <ul className="space-y-3">
                    {data.jobs.map((job, i) => (
                      <motion.li
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * i, duration: 0.3 }}
                      >
                        <a
                          href={job.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex gap-4 p-5 rounded-xl border border-border bg-white hover:border-accent-mid transition-all duration-200 hover:shadow-card"
                          style={{ textDecoration: "none" }}
                        >
                          <CompanyAvatar name={job.company} />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors text-base leading-snug">
                                {job.title}
                              </h3>
                              <svg
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5"
                              >
                                <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                              </svg>
                            </div>

                            <p className="text-text-secondary text-sm mt-0.5">{job.company}</p>

                            {job.location && (
                              <p className="text-text-muted text-xs mt-1 flex items-center gap-1">
                                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                                  <path fillRule="evenodd" d="M8 2a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4Zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" clipRule="evenodd" />
                                </svg>
                                {job.location}
                              </p>
                            )}

                            {job.snippet && (
                              <p className="text-text-muted text-sm mt-2 line-clamp-2 leading-relaxed">
                                {job.snippet}
                              </p>
                            )}
                          </div>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
