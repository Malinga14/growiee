"use client";

import { motion } from "framer-motion";
import { growIn, inView } from "@/components/charts/reveal";

/**
 * A row of fine vertical ticks with the first part filled: a share against
 * a whole. Both layers are one repeating gradient, so a hundred ticks cost
 * two elements; the filled layer grows from the left with a transform.
 */
export default function TickMeter({
  share,
  color,
  track = "#D9DBF3",
  delay = 0,
}: {
  share: number;
  color: string;
  track?: string;
  delay?: number;
}) {
  const p = Math.max(0, Math.min(share, 1));
  const ticks = (c: string) =>
    `repeating-linear-gradient(90deg, ${c} 0 2px, transparent 2px 6px)`;
  return (
    <div className="relative h-6" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: ticks(track) }}
      />
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{ width: `${p * 100}%`, background: ticks(color), originX: 0 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={inView}
        transition={growIn(delay)}
      />
      <motion.span
        className="absolute -bottom-1 -top-1 w-[3px] -translate-x-1/2 rounded-full bg-ink"
        style={{ left: `${p * 100}%` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={inView}
        transition={{ delay: delay + 0.5 }}
      />
    </div>
  );
}
