import classNames from "classnames";
import { colors } from "@/config/theme";

/**
 * A tiny trend line that sweeps in from the left (CSS, so it plays before
 * hydration).
 * Colour follows the net direction.
 */
export default function Sparkline({
  values,
  delay = 0,
  className,
}: {
  values: number[];
  /** Seconds to wait before drawing, to stagger a row of sparklines. */
  delay?: number;
  className?: string;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = 100 / (values.length - 1);
  const line = values
    .map((v, i) => {
      const x = (i * step).toFixed(2);
      const y = (30 - ((v - min) / span) * 26).toFixed(2);
      return `${i ? "L" : "M"}${x},${y}`;
    })
    .join(" ");
  const up = values[values.length - 1] >= values[0];
  const color = up ? colors.gain : colors.loss;
  const gradientId = `spark-${up ? "up" : "down"}`;

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={classNames("animate-reveal", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.16} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${line} L100,32 L0,32 Z`} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
