"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { growIn, inView } from "@/components/charts/reveal";
import { barPath, linear, niceTicks } from "@/components/charts/scale";
import { chart } from "@/config/theme";
import { useWidth } from "@/hooks/useSize";
import { formatCompactMoney, formatMoney } from "@/lib/format";

export type Step = {
  key: string;
  label: string;
  /** Totals are absolute; everything else is a change from the last bar. */
  value: number;
  total?: boolean;
};

/**
 * Waterfall: what's collected, each cost stepping down from it, and what's
 * left. Each step drops in from the previous level in sequence, joined to
 * the next by a hairline, so the eye walks the money down the page.
 */
export default function Waterfall({
  steps,
  height = 300,
  title,
}: {
  steps: Step[];
  height?: number;
  title: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  let run = 0;
  const bars = steps.map((s) => {
    const from = s.total ? 0 : run;
    const to = s.total ? s.value : run + s.value;
    run = to;
    return { ...s, from, to };
  });
  const lo = Math.min(0, ...bars.flatMap((b) => [b.from, b.to]));
  const hi = Math.max(0, ...bars.flatMap((b) => [b.from, b.to]));
  const ticks = niceTicks(lo, hi, 4);
  const m = { top: 24, right: 8, bottom: 30, left: 48 };
  const innerW = Math.max(10, width - m.left - m.right);
  const y = linear(ticks[0], ticks[ticks.length - 1], height - m.bottom, m.top);
  const slot = innerW / steps.length;
  const bw = Math.min(24, slot * 0.5);

  const fill = (b: (typeof bars)[number]) =>
    b.total
      ? b.to >= 0
        ? b.key === bars[0].key
          ? chart.sky
          : chart.positive
        : chart.negative
      : b.value < 0
        ? chart.pink
        : chart.indigo;

  return (
    <div ref={ref} className="relative" style={{ height }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={title}
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              x2={width - m.right}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 0 ? "#D4D6E4" : chart.grid}
            />
            <text
              x={m.left - 8}
              y={y(t)}
              dy="0.32em"
              textAnchor="end"
              fontSize={11}
              fill={chart.tick}
              className="tabular"
            >
              {formatCompactMoney(t, false)}
            </text>
          </g>
        ))}

        {bars.map((b, i) => {
          const x = m.left + slot * i + (slot - bw) / 2;
          const next = bars[i + 1];
          // Decreases hang from the previous level; totals stand on zero.
          const d = b.total
            ? barPath(x, y(0), y(b.to), bw)
            : roundedBlock(
                x,
                y(Math.max(b.from, b.to)),
                y(Math.min(b.from, b.to)),
                bw,
              );
          const origin = b.total ? y(0) : y(b.from);
          return (
            <g
              key={b.key}
              style={{
                opacity: hover !== null && hover !== i ? 0.4 : 1,
                transition: "opacity 200ms",
              }}
            >
              {next && (
                <motion.line
                  x1={x + bw}
                  x2={m.left + slot * (i + 1) + (slot - bw) / 2}
                  y1={y(b.to)}
                  y2={y(b.to)}
                  stroke="#C9CCE0"
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={inView}
                  transition={{ delay: 0.25 + i * 0.12 }}
                />
              )}
              {d && (
                <motion.path
                  d={d}
                  fill={fill(b)}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={inView}
                  transition={growIn(0.1 + i * 0.12)}
                  style={{ originY: `${origin}px`, transformBox: "view-box" }}
                />
              )}
              <motion.text
                x={x + bw / 2}
                y={Math.min(y(b.from), y(b.to)) - 7}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#222F3E"
                className="tabular"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={inView}
                transition={{ delay: 0.4 + i * 0.12 }}
              >
                {b.total
                  ? formatCompactMoney(b.to, false)
                  : `−${formatCompactMoney(Math.abs(b.value), false)}`}
              </motion.text>
              <text
                x={x + bw / 2}
                y={height - 9}
                textAnchor="middle"
                fontSize={11}
                fill={b.total ? "#222F3E" : chart.tick}
                fontWeight={b.total ? 600 : 400}
              >
                {b.label}
              </text>
              <rect
                x={m.left + slot * i}
                y={m.top}
                width={slot}
                height={height - m.top - m.bottom}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
          style={{
            left: Math.min(
              Math.max(m.left + slot * hover + slot / 2, 90),
              width - 90,
            ),
            top: Math.max(
              Math.min(y(bars[hover].from), y(bars[hover].to)) - 22,
              70,
            ),
          }}
        >
          <ChartTooltip
            title={bars[hover].label}
            rows={[
              bars[hover].total
                ? {
                    label: "Total",
                    value: formatMoney(bars[hover].to),
                    swatch: fill(bars[hover]),
                  }
                : {
                    label: "Cost",
                    value: formatMoney(bars[hover].value),
                    swatch: fill(bars[hover]),
                  },
              { label: "Running total", value: formatMoney(bars[hover].to) },
            ]}
          />
        </div>
      )}
    </div>
  );
}

/** A floating block with all four corners softly rounded. */
function roundedBlock(
  x: number,
  top: number,
  bottom: number,
  w: number,
  r = 3,
) {
  const h = bottom - top;
  if (h < 0.5) return "";
  const rr = Math.min(r, w / 2, h / 2);
  return `M${x + rr},${top}H${x + w - rr}Q${x + w},${top} ${x + w},${top + rr}V${bottom - rr}Q${x + w},${bottom} ${x + w - rr},${bottom}H${x + rr}Q${x},${bottom} ${x},${bottom - rr}V${top + rr}Q${x},${top} ${x + rr},${top}Z`;
}
