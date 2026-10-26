"use client";

import { motion } from "framer-motion";
import { growIn, inView } from "@/components/charts/reveal";

/**
 * A single ratio against a goal. The track is a lighter step of the same
 * hue, so the whole bar reads as one scale; past the goal it stays full.
 */
export default function Meter({
  value,
  label,
  detail,
  color = "#434BB8",
}: {
  value: number;
  label: React.ReactNode;
  detail?: React.ReactNode;
  color?: string;
}) {
  const p = Math.max(0, Math.min(value, 1));
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className="tabular font-semibold text-ink">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full"
        style={{ backgroundColor: `${color}26` }}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ width: `${p * 100}%`, backgroundColor: color, originX: 0 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={inView}
          transition={growIn(0.15)}
        />
      </div>
      {detail && <p className="mt-2 text-xs text-ink-faint">{detail}</p>}
    </div>
  );
}
