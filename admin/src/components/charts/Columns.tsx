"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChartTooltip from "@/components/charts/ChartTooltip";
import Legend from "@/components/charts/Legend";
import { growIn, inView } from "@/components/charts/reveal";
import { barPath, linear, niceTicks } from "@/components/charts/scale";
import { chart } from "@/config/theme";
import { useWidth } from "@/hooks/useSize";
import { formatCompactMoney, formatMoney } from "@/lib/format";

export type Series = { key: string; label: string; color: string };
export type Row = {
  key: string;
  label: string;
  values: Record<string, number>;
};

type Props = {
  rows: Row[];
  series: Series[];
  height?: number;
  /** Colour a single-series bar by its value (e.g. profit vs loss). */
  colorFor?: (value: number) => string;
  format?: (v: number) => string;
  tick?: (v: number) => string;
  /** Value labels on the bar ends: none, or only the first/last/extremes. */
  labels?: "none" | "ends";
  title: string;
};

/**
 * Column chart: single series (optionally coloured by sign) or stacked.
 * Columns grow from the zero line on a spring as the chart scrolls into
 * view; stacked segments are split by a 2px surface gap. Hover dims the
 * other columns and shows every value in a tooltip.
 */
export default function Columns({
  rows,
  series,
  height = 260,
  colorFor,
  format = formatMoney,
  tick = (v) => formatCompactMoney(v, false),
  labels = "ends",
  title,
}: Props) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const stacked = series.length > 1;

  const totals = rows.map((r) =>
    series.reduce((t, s) => t + (r.values[s.key] ?? 0), 0),
  );
  const lo = Math.min(0, ...totals);
  const hi = Math.max(0, ...totals);
  const ticks = niceTicks(lo, hi, 4);
  const m = { top: 22, right: 8, bottom: 28, left: 48 };
  const innerW = Math.max(10, width - m.left - m.right);
  const y = linear(ticks[0], ticks[ticks.length - 1], height - m.bottom, m.top);
  const slot = innerW / Math.max(rows.length, 1);
  const bw = Math.min(24, slot * 0.62);
  const zero = y(0);
  const labelEvery = Math.ceil(rows.length / Math.max(1, innerW / 44));

  const extremes = new Set<number>();
  if (labels === "ends" && rows.length) {
    extremes.add(rows.length - 1);
    if (!stacked) {
      extremes.add(totals.indexOf(Math.max(...totals)));
      extremes.add(totals.indexOf(Math.min(...totals)));
    }
  }

  const hovered = hover === null ? null : rows[hover];

  return (
    <div>
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
                strokeWidth={1}
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
                {tick(t)}
              </text>
            </g>
          ))}

          {rows.map((row, i) => {
            const x = m.left + slot * i + (slot - bw) / 2;
            let base = 0;
            const dim = hover !== null && hover !== i;
            return (
              <g
                key={row.key}
                style={{ opacity: dim ? 0.4 : 1, transition: "opacity 200ms" }}
              >
                {series.map((s, si) => {
                  const v = row.values[s.key] ?? 0;
                  const y0 = y(base);
                  const y1 = y(base + v);
                  base += v;
                  const last = si === series.length - 1;
                  // 2px surface gap between stacked segments.
                  const gapTop = stacked && !last ? 1 : 0;
                  const gapBottom = stacked && si > 0 ? 1 : 0;
                  const d = last
                    ? barPath(x, y0 - gapBottom, y1, bw)
                    : rectPath(x, y1 + gapTop, y0 - gapBottom, bw);
                  if (!d) return null;
                  return (
                    <motion.path
                      key={s.key}
                      d={d}
                      fill={!stacked && colorFor ? colorFor(v) : s.color}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={inView}
                      transition={growIn(0.05 + i * 0.035)}
                      style={{
                        originY: `${zero}px`,
                        transformBox: "view-box",
                      }}
                    />
                  );
                })}
                {extremes.has(i) && (
                  <motion.text
                    x={x + bw / 2}
                    y={totals[i] >= 0 ? y(totals[i]) - 7 : y(totals[i]) + 14}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={600}
                    fill="#222F3E"
                    className="tabular"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={inView}
                    transition={{ delay: 0.5 + i * 0.035 }}
                  >
                    {tick(totals[i])}
                  </motion.text>
                )}
                {i % labelEvery === 0 && (
                  <text
                    x={x + bw / 2}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize={11}
                    fill={chart.tick}
                  >
                    {row.label}
                  </text>
                )}
                {/* Hit target: the whole slot, taller than the mark. */}
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

        {hovered && hover !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
            style={{
              left: Math.min(
                Math.max(m.left + slot * hover + slot / 2, 90),
                width - 90,
              ),
              top: Math.max(y(Math.max(0, totals[hover])) - 10, 70),
            }}
          >
            <ChartTooltip
              title={hovered.label}
              rows={[
                ...series.map((s) => ({
                  label: s.label,
                  value: format(hovered.values[s.key] ?? 0),
                  swatch:
                    !stacked && colorFor
                      ? colorFor(hovered.values[s.key] ?? 0)
                      : s.color,
                })),
                ...(stacked
                  ? [{ label: "Total", value: format(totals[hover]) }]
                  : []),
              ]}
            />
          </div>
        )}
      </div>
      {stacked && (
        <Legend
          className="mt-3 grid grid-cols-2 gap-x-6 divide-y-0 sm:grid-cols-4"
          items={series.map((s) => ({
            key: s.key,
            label: s.label,
            color: s.color,
          }))}
        />
      )}
    </div>
  );
}

function rectPath(x: number, top: number, bottom: number, w: number) {
  if (bottom - top < 0.5) return "";
  return `M${x},${top}H${x + w}V${bottom}H${x}Z`;
}
