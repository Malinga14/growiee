"use client";

import { motion } from "framer-motion";
import { growIn, inView } from "@/components/charts/reveal";
import { chart } from "@/config/theme";
import { formatMoney } from "@/lib/format";

export type Rung = {
  key: string;
  label: string;
  price: number | null;
  margin: number;
};

/**
 * Horizontal bars: the pack price each target margin needs. Sequential
 * indigo (more margin, deeper colour); a pink line marks today's price, so
 * the gap to each target is visible at a glance.
 */
export default function PriceLadder({
  rungs,
  current,
}: {
  rungs: Rung[];
  current: number;
}) {
  const max = Math.max(current, ...rungs.map((r) => r.price ?? 0)) * 1.08 || 1;
  const pos = (v: number) => `${(v / max) * 100}%`;
  const ramp = chart.ramp;

  return (
    <div className="relative pt-7">
      <div className="relative ml-[96px] mr-[88px]">
        <div
          className="absolute -bottom-2 -top-6 z-10 w-0.5 rounded-full bg-pink"
          style={{ left: pos(current) }}
          aria-hidden="true"
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-ink shadow-thumb">
            Today {formatMoney(current)}
          </span>
        </div>
      </div>
      <ul className="space-y-3 pt-5">
        {rungs.map((r, i) => (
          <li key={r.key} className="flex items-center gap-3">
            <span className="w-[84px] shrink-0 whitespace-nowrap text-right text-sm text-ink-muted">
              {r.label}
            </span>
            <div className="relative h-6 flex-1">
              <div className="absolute inset-0 rounded-md bg-ink/[0.04]" />
              {r.price !== null && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{
                    width: pos(r.price),
                    backgroundColor: ramp[Math.min(ramp.length - 1, 2 + i)],
                    originX: 0,
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={inView}
                  transition={growIn(0.1 + i * 0.08)}
                />
              )}
            </div>
            <span className="tabular w-[76px] shrink-0 text-sm font-semibold text-ink">
              {r.price === null ? "—" : formatMoney(r.price, false)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 pl-[96px] text-xs text-ink-faint">
        Pack price (LKR) per target margin
      </p>
    </div>
  );
}
