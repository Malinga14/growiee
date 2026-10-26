"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Legend from "@/components/charts/Legend";
import { arcPath } from "@/components/charts/scale";
import { drawIn, inView } from "@/components/charts/reveal";
import { formatMoney, formatShare } from "@/lib/format";

export type Slice = {
  key: string;
  label: string;
  value: number;
  color: string;
};

/**
 * Part-to-whole ring. Segments draw on in sequence, separated by a 2px
 * surface gap; hovering a segment or its legend row lifts it and puts its
 * value in the centre.
 */
export default function Donut({
  slices,
  centerLabel,
  centerValue,
  size = 220,
  thickness = 22,
  format = formatMoney,
}: {
  slices: Slice[];
  centerLabel: string;
  centerValue: React.ReactNode;
  size?: number;
  thickness?: number;
  format?: (v: number) => string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const parts = slices.filter((s) => s.value > 0);
  const total = parts.reduce((t, s) => t + s.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 4;
  const c = size / 2;
  const gap = 2 / r; // 2px surface gap, in radians
  let a = 0;
  const arcs = parts.map((s) => {
    const sweep = (s.value / total) * Math.PI * 2;
    const a0 = a + gap / 2;
    const a1 = a + Math.max(sweep - gap / 2, gap / 2 + 0.001);
    a += sweep;
    return { ...s, d: arcPath(c, c, r, a0, a1) };
  });
  const hovered = parts.find((s) => s.key === active);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          role="img"
          aria-label={`${centerLabel}: ${parts.map((p) => `${p.label} ${format(p.value)}`).join(", ")}`}
        >
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="rgba(45,52,141,0.06)"
            strokeWidth={thickness}
          />
          {arcs.map((s, i) => (
            <motion.path
              key={s.key}
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeLinecap="butt"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={inView}
              animate={{
                strokeWidth: active === s.key ? thickness + 6 : thickness,
                opacity: active && active !== s.key ? 0.35 : 1,
              }}
              transition={{
                pathLength: drawIn(0.1 + i * 0.12),
                default: { type: "spring", bounce: 0, duration: 0.3 },
              }}
              onMouseEnter={() => setActive(s.key)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div className="px-8">
            <p className="text-xs font-medium text-ink-muted">
              {hovered ? hovered.label : centerLabel}
            </p>
            <p className="mt-0.5 text-[22px] font-semibold leading-tight tracking-title text-ink">
              {hovered ? format(hovered.value) : centerValue}
            </p>
            {hovered && (
              <p className="text-xs text-ink-faint">
                {formatShare(hovered.value / total)}
              </p>
            )}
          </div>
        </div>
      </div>
      <Legend
        className="w-full min-w-0 flex-1"
        active={active}
        onHover={setActive}
        items={parts.map((s) => ({
          key: s.key,
          label: s.label,
          color: s.color,
          value: format(s.value),
          sub: formatShare(s.value / total, 0),
        }))}
      />
    </div>
  );
}
