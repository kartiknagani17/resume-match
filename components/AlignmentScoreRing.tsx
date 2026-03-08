"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AlignmentScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function getScoreStyle(score: number): {
  color: string;
  label: string;
  badgeClass: string;
  ringClass: string;
} {
  if (score >= 80) return { color: "#16A34A", label: "Excellent match",   badgeClass: "badge-green", ringClass: "score-ring-great" };
  if (score >= 60) return { color: "#2563EB", label: "Good match",        badgeClass: "badge-blue",  ringClass: "score-ring-good"  };
  if (score >= 40) return { color: "#CA8A04", label: "Moderate match",    badgeClass: "badge-amber", ringClass: "score-ring-okay"  };
  return              { color: "#DC2626", label: "Needs improvement",  badgeClass: "badge-red",   ringClass: "score-ring-low"   };
}

export function AlignmentScoreRing({
  score,
  size = 192,
  strokeWidth = 12,
}: AlignmentScoreRingProps) {
  const r             = (size - strokeWidth) / 2 - 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset    = circumference - (score / 100) * circumference;

  // Count-up animation
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start    = performance.now();
    const duration = 1400;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [score]);

  const { color, label, badgeClass, ringClass } = getScoreStyle(score);

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={`relative inline-flex items-center justify-center ${ringClass}`}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-heading font-extrabold text-4xl text-text-primary leading-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {display}%
          </motion.span>
          <motion.span
            className="text-xs text-text-muted font-medium mt-1 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Fit Score
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <motion.span
        className={`badge ${badgeClass}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
        {label}
      </motion.span>
    </motion.div>
  );
}
