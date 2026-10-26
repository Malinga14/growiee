import type { Config } from "tailwindcss";
import { colors } from "./src/config/theme";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        // Brand type: Google Sans for body and UI, Nunito for headlines,
        // Pacifico for the Growiee wordmark only.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        wordmark: ["var(--font-wordmark)", "cursive"],
      },
      letterSpacing: {
        // Size-specific tracking: tighten large type, open up small labels.
        display: "-0.02em",
        title: "-0.015em",
        body: "-0.01em",
        label: "0em",
      },
      boxShadow: {
        // Flat brand: hairline borders do the work, shadows only whisper.
        card: "0 1px 2px rgba(34, 47, 62, 0.04)",
        thumb:
          "0 1px 2px rgba(34, 47, 62, 0.08), 0 1px 1px rgba(34, 47, 62, 0.04)",
        edge: "0 1px 0 rgba(34, 47, 62, 0.06)",
      },
      keyframes: {
        "cell-in": {
          from: { opacity: "0", transform: "scale(0.6)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "none" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "cell-in": "cell-in 500ms cubic-bezier(0.32, 0.72, 0, 1) both",
        shimmer: "shimmer 1.8s linear infinite",
      },
      transitionTimingFunction: {
        // iOS sheet curve — fast start, long gentle settle, no overshoot.
        ios: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
