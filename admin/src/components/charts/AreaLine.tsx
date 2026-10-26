"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChartTooltip from "@/components/charts/ChartTooltip";
import { drawIn, inView } from "@/components/charts/reveal";
import { linear, niceTicks } from "@/components/charts/scale";
import { chart } from "@/config/theme";
import { useWidth } from "@/hooks/useSize";
import { formatCompactMoney, formatMoney } from "@/lib/format";

export type Point = { key: string; label: string; value: number };

/**
 * One series over time: a 2px line that draws itself left to right, a 10%
 * wash under it, the end value labelled, and a crosshair + tooltip on
 * hover. Below zero the wash turns rose, so a cash shortfall can't hide.
 */
export default function AreaLine({
  points,
  color = chart.sky,
  height = 240,
  title,
  format = formatMoney,
}: {
  points: Point[];
  color?: string;
  height?: number;
  title: string;
  format?: (v: number) => string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const vals = points.map((p) => p.value);
  const ticks = niceTicks(Math.min(0, ...vals), Math.max(0, ...vals), 4);
  const m = { top: 24, right: 56, bottom: 28, left: 48 };
  const x = linear(0, Math.max(points.length - 1, 1), m.left, width - m.right);
  const y = linear(ticks[0], ticks[ticks.length - 1], height - m.bottom, m.top);
  const line = points
    .map(
      (p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`,
    )
    .join("");
  const zero = y(0);
  const area = `${line}L${x(points.length - 1)},${zero}L${x(0)},${zero}Z`;
  const last = points[points.length - 1];
  const id = `area-${title.replace(/\W/g, "")}`;
  const labelEvery = Math.ceil(points.length / Math.max(1, (width - 100) / 44));

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(
      ((e.clientX - r.left - m.left) / (width - m.left - m.right)) *
        (points.length - 1),
    );
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  }

  return (
    <div ref={ref} className="relative" style={{ height }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={title}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <clipPath id={`${id}-above`}>
            <rect x={0} y={0} width={width} height={zero} />
          </clipPath>
          <clipPath id={`${id}-below`}>
            <rect x={0} y={zero} width={width} height={height} />
          </clipPath>
        </defs>
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
        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text
              key={p.key}
              x={x(i)}
              y={height - 8}
              textAnchor="middle"
              fontSize={11}
              fill={chart.tick}
            >
              {p.label}
            </text>
          ) : null,
        )}

        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={inView}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <path
            d={area}
            fill={color}
            fillOpacity={0.12}
            clipPath={`url(#${id}-above)`}
          />
          <path
            d={area}
            fill={chart.negative}
            fillOpacity={0.12}
            clipPath={`url(#${id}-below)`}
          />
        </motion.g>
        <motion.path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={inView}
          transition={drawIn(0.1)}
        />
        {last && (
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={inView}
            transition={{ delay: 0.9 }}
          >
            <circle
              cx={x(points.length - 1)}
              cy={y(last.value)}
              r={4.5}
              fill={color}
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={x(points.length - 1) + 9}
              y={y(last.value)}
              dy="0.32em"
              fontSize={11}
              fontWeight={600}
              fill="#222F3E"
              className="tabular"
            >
              {formatCompactMoney(last.value, false)}
            </text>
          </motion.g>
        )}

        {hover !== null && (
          <g pointerEvents="none">
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={m.top}
              y2={height - m.bottom}
              stroke="#C9CCE0"
            />
            <circle
              cx={x(hover)}
              cy={y(points[hover].value)}
              r={5}
              fill={color}
              stroke="#fff"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
          style={{
            left: Math.min(Math.max(x(hover), 90), width - 90),
            top: Math.max(y(points[hover].value) - 12, 64),
          }}
        >
          <ChartTooltip
            title={points[hover].label}
            rows={[
              {
                label: title,
                value: format(points[hover].value),
                swatch: color,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
