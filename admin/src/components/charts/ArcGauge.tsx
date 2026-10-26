"use client";

import { motion } from "framer-motion";
import { inView } from "@/components/charts/reveal";
import { chart } from "@/config/theme";

/**
 * Semicircle gauge centred on zero: the arc fills from the top towards the
 * value (indigo above zero, rose below) and a ringed dot swings to it by
 * rotation. Values outside the scale pin to the end and say so.
 */
export default function ArcGauge({
  value,
  min = -0.5,
  max = 0.5,
  width = 260,
  label,
  format = (v: number) => `${Math.round(v * 100)}`,
  suffix = "%",
}: {
  value: number;
  min?: number;
  max?: number;
  width?: number;
  label: string;
  format?: (v: number) => string;
  suffix?: string;
}) {
  const R = width / 2 - 22;
  const cx = width / 2;
  const cy = R + 20;
  const height = cy + 12;
  const clamped = Math.max(min, Math.min(max, value));
  const frac = (v: number) => (v - min) / (max - min); // 0 at left, 1 at right
  const pt = (f: number, r = R) => {
    const a = Math.PI * (1 - f);
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)] as const;
  };
  // Arc from f0 to f1, clockwise when f1 > f0, so it always draws away from f0.
  const arc = (f0: number, f1: number) => {
    const [x0, y0] = pt(f0);
    const [x1, y1] = pt(f1);
    return `M${x0},${y0}A${R},${R} 0 0 ${f1 > f0 ? 1 : 0} ${x1},${y1}`;
  };
  const zero = frac(0);
  const f = frac(clamped);
  const fill = arc(zero, f);
  const color = value >= 0 ? chart.positive : chart.negative;
  const sweep = (f - zero) * 180; // degrees from the top
  const ticks = Array.from({ length: 21 }, (_, i) => i / 20);
  const spring = {
    type: "spring" as const,
    bounce: 0,
    duration: 1.3,
    delay: 0.25,
  };
  const off = value < min || value > max;

  return (
    <div className="relative mx-auto" style={{ width, height: height + 34 }}>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`${label}: ${format(value)}${suffix}`}
      >
        {ticks.map((t) => {
          const major = Math.round(t * 20) % 5 === 0;
          const [x0, y0] = pt(t, R + 9);
          const [x1, y1] = pt(t, R + (major ? 17 : 13));
          return (
            <line
              key={t}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={major ? "#8E93DA" : "#D3D5EA"}
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={arc(0, 1)}
          fill="none"
          stroke="rgba(45,52,141,0.08)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {Math.abs(f - zero) > 0.002 && (
          <motion.path
            d={fill}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={inView}
            transition={spring}
          />
        )}
        <motion.g
          style={{
            originX: `${cx}px`,
            originY: `${cy}px`,
            transformBox: "view-box",
          }}
          initial={{ rotate: 0 }}
          whileInView={{ rotate: sweep }}
          viewport={inView}
          transition={spring}
        >
          <circle cx={cx} cy={cy - R} r={11} fill={color} fillOpacity={0.16} />
          <circle
            cx={cx}
            cy={cy - R}
            r={5.5}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
          />
        </motion.g>
        {[min, 0, max].map((v) => {
          const [x, y] = pt(frac(v), R - 18);
          return (
            <text
              key={v}
              x={x}
              y={y}
              dy="0.32em"
              textAnchor={v === min ? "start" : v === max ? "end" : "middle"}
              fontSize={10}
              fill={chart.tick}
              className="tabular"
            >
              {v > 0 ? "+" : v < 0 ? "−" : ""}
              {Math.abs(Math.round(v * 100))}
              {suffix}
            </text>
          );
        })}
      </svg>
      <div className="absolute inset-x-0 text-center" style={{ top: cy - 52 }}>
        <p className="text-[11px] font-medium text-ink-muted">{label}</p>
        <p className="font-display text-[44px] font-light leading-none tracking-display text-ink">
          {value < 0 ? "−" : ""}
          {format(Math.abs(value))}
          <span className="ml-0.5 text-lg text-ink-muted">{suffix}</span>
        </p>
        {off && (
          <p className="mt-1 text-[11px] text-ink-faint">beyond the scale</p>
        )}
      </div>
    </div>
  );
}
