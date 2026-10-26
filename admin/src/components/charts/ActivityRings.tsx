"use client";

import { motion } from "framer-motion";
import { drawIn, inView } from "@/components/charts/reveal";

export type Ring = {
  key: string;
  label: string;
  /** Progress towards the goal: 1 = goal met. */
  progress: number;
  color: string;
  value: React.ReactNode;
  goal: React.ReactNode;
};

/**
 * Apple-Activity-style rings: each closes as its goal is met. The track is
 * the same hue, faint, so the whole ring reads as one scale; a ring past
 * its goal stays closed and says so in the legend.
 */
export default function ActivityRings({
  rings,
  size = 200,
}: {
  rings: Ring[];
  size?: number;
}) {
  const stroke = 18;
  const step = stroke + 5;
  const c = size / 2;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <svg
        width={size}
        height={size}
        className="shrink-0"
        role="img"
        aria-label={rings
          .map((r) => `${r.label}: ${Math.round(r.progress * 100)}% of goal`)
          .join(", ")}
      >
        {rings.map((ring, i) => {
          const r = c - stroke / 2 - 2 - i * step;
          const p = Math.max(0, Math.min(ring.progress, 1));
          return (
            <g key={ring.key} transform={`rotate(-90 ${c} ${c})`}>
              <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={ring.color}
                strokeOpacity={0.16}
                strokeWidth={stroke}
              />
              {p > 0.005 && (
                <motion.circle
                  cx={c}
                  cy={c}
                  r={r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: p }}
                  viewport={inView}
                  transition={drawIn(0.15 + i * 0.15)}
                />
              )}
            </g>
          );
        })}
      </svg>
      <ul className="w-full min-w-0 flex-1 space-y-4">
        {rings.map((ring) => (
          <li key={ring.key} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
              style={{ backgroundColor: ring.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink-muted">{ring.label}</p>
              <p className="text-lg font-semibold leading-snug text-ink">
                {ring.value}
                <span className="ml-2 text-xs font-medium text-ink-faint">
                  {Math.round(ring.progress * 100)}% of goal
                </span>
              </p>
              <p className="text-xs text-ink-faint">{ring.goal}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
