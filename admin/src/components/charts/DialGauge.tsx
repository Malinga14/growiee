"use client";

import { motion } from "framer-motion";
import { inView } from "@/components/charts/reveal";
import { chart } from "@/config/theme";
import { formatMoney } from "@/lib/format";

/**
 * Compass-style dial: a full ring of fine ticks from 0 to `max`, labels at
 * the four quarters, the current value as a big light numeral in the
 * middle, an indigo marker at its angle and a pink marker at the target.
 * Markers swing into place by rotating their group (a transform, so it
 * stays on the compositor).
 */
export default function DialGauge({
  value,
  target,
  max,
  unit = "LKR",
  size = 220,
  label,
  targetLabel,
}: {
  value: number;
  target: number | null;
  max: number;
  unit?: string;
  size?: number;
  label: string;
  targetLabel: string;
}) {
  const c = size / 2;
  const rTick = c - 8;
  const ticks = 100;
  const deg = (v: number) => (Math.max(0, Math.min(v, max)) / max) * 360;
  const quarters = [0, 0.25, 0.5, 0.75].map((q) => q * max);
  const spring = {
    type: "spring" as const,
    bounce: 0,
    duration: 1.4,
    delay: 0.2,
  };

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`${label}: ${formatMoney(value)}${target ? `; ${targetLabel}: ${formatMoney(target)}` : ""}`}
      >
        {Array.from({ length: ticks }, (_, i) => {
          const major = i % 5 === 0;
          const a = (i / ticks) * Math.PI * 2;
          const r0 = rTick - (major ? 9 : 5);
          return (
            <line
              key={i}
              x1={c + r0 * Math.sin(a)}
              y1={c - r0 * Math.cos(a)}
              x2={c + rTick * Math.sin(a)}
              y2={c - rTick * Math.cos(a)}
              stroke={major ? "#8E93DA" : "#D3D5EA"}
              strokeWidth={major ? 1.4 : 1}
              strokeLinecap="round"
            />
          );
        })}
        {quarters.map((q, i) => {
          const a = (i / 4) * Math.PI * 2;
          const r = rTick - 28;
          return (
            <text
              key={q}
              x={c + r * Math.sin(a)}
              y={c - r * Math.cos(a)}
              dy="0.32em"
              textAnchor="middle"
              fontSize={10}
              fill={chart.tick}
              className="tabular"
            >
              {q === 0 ? "0" : `${+(q / 1000).toFixed(2)}K`}
            </text>
          );
        })}

        {/* Swept arc from 0 to the value: a faint indigo wash on the ring. */}
        <motion.circle
          cx={c}
          cy={c}
          r={rTick - 4.5}
          fill="none"
          stroke={chart.indigo}
          strokeOpacity={0.18}
          strokeWidth={9}
          transform={`rotate(-90 ${c} ${c})`}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: deg(value) / 360 }}
          viewport={inView}
          transition={spring}
        />

        {target !== null && (
          <motion.g
            style={{
              originX: `${c}px`,
              originY: `${c}px`,
              transformBox: "view-box",
            }}
            initial={{ rotate: 0, opacity: 0 }}
            whileInView={{ rotate: deg(target), opacity: 1 }}
            viewport={inView}
            transition={{ ...spring, delay: 0.35 }}
          >
            <circle
              cx={c}
              cy={c - rTick + 4.5}
              r={5}
              fill={chart.pink}
              stroke="#fff"
              strokeWidth={2}
            />
          </motion.g>
        )}
        <motion.g
          style={{
            originX: `${c}px`,
            originY: `${c}px`,
            transformBox: "view-box",
          }}
          initial={{ rotate: 0 }}
          whileInView={{ rotate: deg(value) }}
          viewport={inView}
          transition={spring}
        >
          <circle
            cx={c}
            cy={c - rTick + 4.5}
            r={11}
            fill={chart.indigo}
            fillOpacity={0.16}
          />
          <circle
            cx={c}
            cy={c - rTick + 4.5}
            r={5.5}
            fill={chart.indigo}
            stroke="#fff"
            strokeWidth={2}
          />
        </motion.g>
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[11px] font-medium text-ink-muted">{label}</p>
          <p className="font-display text-[44px] font-light leading-none tracking-display text-ink">
            {Math.round(value).toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[11px] font-medium text-ink-faint">{unit}</p>
        </div>
      </div>
    </div>
  );
}
