"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeywordItem {
  keyword: string;
  tip: string;
}

interface KeywordCardsProps {
  keywords: KeywordItem[];
}

/* Cycle through a small set of tasteful accent combos */
const ACCENTS = [
  { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" },
  { bg: "#FDF2F8", color: "#9D174D", border: "#FBCFE8" },
  { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
];

export function KeywordCards({ keywords }: KeywordCardsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (k: string) => {
    navigator.clipboard.writeText(k);
    setCopied(k);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {keywords.map((item, i) => {
        const { bg, color, border } = ACCENTS[i % ACCENTS.length];
        const isCopied = copied === item.keyword;

        return (
          <motion.div
            key={item.keyword}
            className="rounded-xl border bg-white p-4 flex flex-col gap-2 cursor-default"
            style={{ borderColor: border }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.3, ease: "easeOut" }}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between gap-2">
              {/* Keyword chip */}
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: bg, color, border: `1px solid ${border}` }}
              >
                {item.keyword}
              </span>

              {/* Copy button */}
              <button
                type="button"
                onClick={() => copy(item.keyword)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium border transition-all duration-150"
                style={
                  isCopied
                    ? { background: bg, color, borderColor: border }
                    : { background: "#F8FAFC", color: "#475569", borderColor: "#E2E8F0" }
                }
                aria-label="Copy keyword"
              >
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      Copied ✓
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      Copy
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed">{item.tip}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
