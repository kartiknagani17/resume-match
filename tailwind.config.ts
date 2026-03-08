import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FFFFFF",
          muted:   "#F8FAFC",
          card:    "#FFFFFF",
          blue:    "#EFF6FF",
        },
        accent: {
          DEFAULT: "#2563EB",
          hover:   "#1D4ED8",
          light:   "#EFF6FF",
          mid:     "#BFDBFE",
          dark:    "#1E40AF",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong:  "#CBD5E1",
          accent:  "#BFDBFE",
        },
        text: {
          primary:   "#0F172A",
          secondary: "#475569",
          muted:     "#94A3B8",
        },
        score: {
          great:  "#16A34A",
          good:   "#2563EB",
          okay:   "#CA8A04",
          low:    "#DC2626",
        },
      },
      fontFamily: {
        sans:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        body:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        xs:            "0 1px 2px rgba(0,0,0,0.05)",
        sm:            "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        card:          "0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
        "card-hover":  "0 0 0 1px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.1)",
        "card-accent": "0 0 0 1px rgba(37,99,235,0.15), 0 4px 16px rgba(37,99,235,0.08)",
        focus:         "0 0 0 3px rgba(37,99,235,0.18)",
        btn:           "0 1px 3px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        "btn-hover":   "0 4px 14px rgba(37,99,235,0.35)",
        ring:          "0 0 0 1px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.08)",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.94)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-5px)" },
        },
      },
      animation: {
        shimmer:   "shimmer 1.8s linear infinite",
        "fade-up": "fade-up 0.4s ease-out",
        "scale-in":"scale-in 0.3s ease-out",
        float:     "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
