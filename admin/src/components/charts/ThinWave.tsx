"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { inView } from "@/components/charts/reveal";
import { chart } from "@/config/theme";
import { useWidth } from "@/hooks/useSize";
import { formatCompactMoney, formatMoney } from "@/lib/format";
import { iosEase } from "@/lib/motion";

export type WavePoint = {
  key: string;
  label: string;
  up: number;
  down: number;
};

/**
 * Dense mirrored line chart: one hairline per period above a centre axis
 * for money in, one below for money out. On reveal the lines grow out of
 * the axis in a left-to-right wave (transform only). Hover snaps a
 * crosshair to the nearest period.
 */
export default function ThinWave({
  points,
  upLabel,
  downLabel,
  upColor = "#B9BCE9",
  downColor = chart.pink,
  height = 190,
  title,
}: {
  points: WavePoint[];
  upLabel: string;
  downLabel: string;
  upColor?: string;
  downColor?: string;
  height?: number;
  title: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>(320);
  const [hover, setHover] = useState<number | null>(null);
  const m = { top: 10, right: 34, bottom: 10, left: 34 };
  const mid = m.top + (height - m.top - m.bottom) / 2;
  const half = (height - m.top - m.bottom) / 2 - 4;
  const max = Math.max(1, ...points.map((p) => Math.max(p.up, p.down)));
  const n = points.length;
  const step = (width - m.left - m.right) / Math.max(n - 1, 1);
  const x = (i: number) => m.left + i * step;
  const h = (v: number) => (Math.max(0, v) / max) * half;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - r.left - m.left) / step);
    setHover(Math.max(0, Math.min(n - 1, i)));
  }

  const p = hover === null ? null : points[hover];

  return (
    <div>
      <div ref={ref} className="relative" style={{ height }}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={title}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <text
            x={4}
            y={m.top + 8}
            fontSize={10}
            fill={chart.tick}
            className="tabular"
          >
            {formatCompactMoney(max, false)}
          </text>
          <text x={4} y={mid} dy="0.32em" fontSize={10} fill={chart.tick}>
            0
          </text>
          <text
            x={4}
            y={height - m.bottom}
            fontSize={10}
            fill={chart.tick}
            className="tabular"
          >
            {formatCompactMoney(max, false)}
          </text>
          <line
            x1={m.left}
            x2={width - m.right}
            y1={mid}
            y2={mid}
            stroke="#D4D6E4"
          />

          {points.map((pt, i) => {
            const dim = hover !== null && hover !== i;
            const delay = 0.15 + (i / n) * 0.9;
            const t = { duration: 0.6, ease: iosEase, delay };
            return (
              <g
                key={pt.key}
                style={{ opacity: dim ? 0.35 : 1, transition: "opacity 160ms" }}
              >
                <motion.line
                  x1={x(i)}
                  x2={x(i)}
                  y1={mid - 1}
                  y2={mid - 1 - h(pt.up)}
                  stroke={upColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={inView}
                  transition={t}
                  style={{ originY: `${mid}px`, transformBox: "view-box" }}
                />
                <motion.line
                  x1={x(i)}
                  x2={x(i)}
                  y1={mid + 1}
                  y2={mid + 1 + h(pt.down)}
                  stroke={downColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={inView}
                  transition={t}
                  style={{ originY: `${mid}px`, transformBox: "view-box" }}
                />
              </g>
            );
          })}

          {hover !== null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={m.top}
              y2={height - m.bottom}
              stroke="#222F3E"
              strokeOpacity={0.25}
              pointerEvents="none"
            />
          )}
        </svg>
        {p && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2"
            style={{ left: Math.min(Math.max(x(hover), 84), width - 84) }}
          >
            <ChartTooltip
              title={p.label}
              rows={[
                { label: upLabel, value: formatMoney(p.up), swatch: upColor },
                {
                  label: downLabel,
                  value: formatMoney(p.down),
                  swatch: downColor,
                },
              ]}
            />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-center gap-5 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-4 rounded-full"
            style={{ backgroundColor: upColor }}
          />
          {upLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-4 rounded-full"
            style={{ backgroundColor: downColor }}
          />
          {downLabel}
        </span>
      </div>
    </div>
  );
}
