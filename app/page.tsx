"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Nav } from "@/components/Nav";

/* ─────────────────────────────────────────
   Hero UI Mockup — looks like the real app
───────────────────────────────────────── */
function HeroMockup() {
  const keywords = ["React", "TypeScript", "REST APIs", "CI/CD", "Node.js"];

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      {/* Main card */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Faux browser chrome */}
        <div className="px-5 py-3 border-b border-border flex items-center gap-3 bg-surface-muted">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
          </div>
          <div className="flex-1 h-5 rounded-md bg-border flex items-center px-3">
            <span className="text-[10px] text-text-muted font-medium">
              resumematch.io/analyze
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Score row */}
          <div className="flex items-center gap-5">
            {/* Ring */}
            <div className="relative w-[76px] h-[76px] flex-shrink-0">
              <svg width="76" height="76" className="-rotate-90">
                <defs>
                  <linearGradient id="mockGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <circle cx="38" cy="38" r="30" fill="none" stroke="#E2E8F0" strokeWidth="7" />
                <motion.circle
                  cx="38" cy="38" r="30"
                  fill="none"
                  stroke="url(#mockGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={188.5}
                  initial={{ strokeDashoffset: 188.5 }}
                  animate={{ strokeDashoffset: 188.5 * 0.13 }}
                  transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-base text-text-primary">
                87%
              </span>
            </div>

            <div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-1">
                Alignment Score
              </p>
              <p className="font-bold text-text-primary text-base">Senior React Engineer</p>
              <span className="inline-flex items-center gap-1 text-xs text-score-great font-semibold mt-1">
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
                  <path d="M10.28 2.28a.75.75 0 0 0-1.06 0L4.5 7 2.78 5.28a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l5.25-5.25a.75.75 0 0 0 0-1.06Z" />
                </svg>
                Strong match
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-[11px] text-text-muted mb-1.5 font-medium">
              <span>Resume fit</span>
              <span>87 / 100</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Keywords */}
          <div className="mt-5">
            <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-2">
              Keywords to add
            </p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-light text-accent-dark border border-accent-mid"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Mini explanation */}
          <div className="mt-4 p-3 rounded-xl bg-surface-muted">
            <p className="text-xs text-text-secondary leading-relaxed">
              Your resume demonstrates strong frontend skills. Consider adding mentions of CI/CD pipelines and REST API design to close remaining gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Floating tag 1 */}
      <motion.div
        className="absolute -top-4 -right-5 bg-white rounded-xl px-3 py-2 shadow-card flex items-center gap-2 border border-border"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        style={{ animation: "float 5s ease-in-out infinite" }}
      >
        <span className="text-score-great text-sm">✓</span>
        <span className="text-text-primary text-xs font-semibold">14 jobs found</span>
      </motion.div>

      {/* Floating tag 2 */}
      <motion.div
        className="absolute -bottom-4 -left-5 bg-white rounded-xl px-3 py-2 shadow-card flex items-center gap-2 border border-border"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0 }}
        style={{ animation: "float 6s ease-in-out infinite 1s" }}
      >
        <svg viewBox="0 0 16 16" fill="#2563EB" className="w-3.5 h-3.5">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Z" opacity=".2" />
          <path d="m5.25 7.5 1.75 1.75 3.75-3.75" stroke="#2563EB" strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-text-secondary text-xs font-medium">Powered by Gemini AI</span>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Feature card
───────────────────────────────────────── */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accentBg: string;
  accentColor: string;
  delay: number;
  inView: boolean;
}

function FeatureCard({ icon, title, desc, accentBg, accentColor, delay, inView }: FeatureCardProps) {
  return (
    <motion.div
      className="card card-accent p-6 flex flex-col gap-4 cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accentBg, color: accentColor }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-heading font-bold text-base text-text-primary mb-1.5">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function HomePage() {
  const featuresRef = useRef<HTMLElement>(null);
  const stepsRef    = useRef<HTMLElement>(null);
  const ctaRef      = useRef<HTMLElement>(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const stepsInView    = useInView(stepsRef,    { once: true, margin: "-60px" });
  const ctaInView      = useInView(ctaRef,      { once: true, margin: "-40px" });
  const reduced        = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: reduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: "easeOut", delay },
  });

  return (
    <>
      <Nav />

      <main>
        {/* ─── HERO ──────────────────────────────────── */}
        <section className="hero-bg pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div className="space-y-6">
              <motion.div {...fadeUp(0)}>
                <span className="badge badge-blue">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  Powered by Gemini 2.5 Flash
                </span>
              </motion.div>

              <motion.h1
                className="font-heading font-extrabold text-[2.6rem] sm:text-5xl lg:text-[3.2rem] leading-[1.08] tracking-tight text-text-primary"
                {...fadeUp(0.08)}
              >
                Your resume,{" "}
                <span className="text-accent">perfectly</span>{" "}
                matched.
              </motion.h1>

              <motion.p
                className="text-lg text-text-secondary leading-relaxed max-w-lg"
                {...fadeUp(0.17)}
              >
                Get an AI-powered fit score for any job, discover the keywords you're missing, and find
                roles that actually match your profile — all in under 10 seconds.
              </motion.p>

              <motion.div className="flex flex-wrap gap-3 pt-1" {...fadeUp(0.26)}>
                <Link href="/analyze" className="btn-primary">
                  Analyze my resume
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="/jobs" className="btn-outline">
                  Find jobs for me
                </Link>
              </motion.div>

              {/* Stats strip */}
              <motion.div
                className="flex flex-wrap items-center gap-5 pt-2"
                {...fadeUp(0.34)}
              >
                {[
                  { value: "2,400+", label: "resumes analyzed" },
                  { value: "0.3s",   label: "avg. response time" },
                  { value: "Free",   label: "to use" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="font-bold text-text-primary text-sm">{value}</span>
                    <span className="text-text-muted text-sm">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: product mockup */}
            <div className="relative flex justify-center">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────── */}
        <section ref={featuresRef} className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
            >
              <p className="text-accent text-sm font-bold uppercase tracking-widest mb-3">
                What you get
              </p>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-primary">
                Everything you need to land the role
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FeatureCard
                inView={featuresInView}
                delay={0.05}
                accentBg="#EFF6FF"
                accentColor="#2563EB"
                title="Alignment Score"
                desc="Upload your resume + job description. Get a 0–100% fit score and a clear explanation of your strengths and gaps."
                icon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
                  </svg>
                }
              />
              <FeatureCard
                inView={featuresInView}
                delay={0.12}
                accentBg="#F0FDF4"
                accentColor="#16A34A"
                title="Keyword Suggestions"
                desc="We scan the job description for keywords missing from your resume and give actionable tips to close the gap."
                icon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                }
              />
              <FeatureCard
                inView={featuresInView}
                delay={0.2}
                accentBg="#FFFBEB"
                accentColor="#B45309"
                title="Find Matching Jobs"
                desc="Upload your resume and we'll extract your role and skills, then search job boards to surface roles that fit you."
                icon={
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                  </svg>
                }
              />
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ──────────────────────────── */}
        <section ref={stepsRef} className="py-20 sm:py-28 bg-surface-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 16 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
            >
              <p className="text-accent text-sm font-bold uppercase tracking-widest mb-3">
                How it works
              </p>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-primary">
                Three steps to a better application
              </h2>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0">
              {[
                { n: "1", title: "Upload",  body: "Drop your resume in PDF, DOCX, or TXT. Up to 10 MB.",                 color: "#2563EB", bg: "#EFF6FF" },
                { n: "2", title: "Analyze", body: "Gemini AI reads your resume and the job description to score your fit.", color: "#16A34A", bg: "#F0FDF4" },
                { n: "3", title: "Improve", body: "Apply keyword suggestions, download your report, and search for jobs.", color: "#B45309", bg: "#FFFBEB" },
              ].map((step, i) => (
                <div key={step.n} className="flex sm:flex-col sm:flex-1 items-start sm:items-center gap-4 sm:gap-0">
                  <motion.div
                    className="sm:text-center"
                    initial={{ opacity: 0, y: 16 }}
                    animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.12 * i }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-extrabold text-lg mb-0 sm:mb-5 sm:mx-auto"
                      style={{ background: step.bg, color: step.color }}
                    >
                      {step.n}
                    </div>
                    <div className="ml-4 sm:ml-0 sm:px-4">
                      <h3 className="font-heading font-bold text-text-primary mb-1">{step.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{step.body}</p>
                    </div>
                  </motion.div>
                  {i < 2 && (
                    <div className="hidden sm:flex flex-1 items-center justify-center pt-5">
                      <div className="w-full h-px bg-border-strong mx-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ────────────────────────────── */}
        <section ref={ctaRef} className="py-20 sm:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              className="rounded-2xl bg-accent-light border border-accent-mid p-10 sm:p-14 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-primary mb-4">
                Ready to see how you stack up?
              </h2>
              <p className="text-text-secondary text-base mb-8 max-w-md mx-auto">
                Upload your resume and paste a job description to get your score in seconds. No signup required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/analyze" className="btn-primary">
                  Analyze my resume
                </Link>
                <Link href="/jobs" className="btn-outline">
                  Find matching jobs
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-surface-muted py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-heading font-bold text-text-primary">
              Resume<span className="text-accent">Match</span>
            </span>
            <p className="text-text-muted text-sm">
              Built with Next.js · Gemini AI · JSearch · Tailwind CSS
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
