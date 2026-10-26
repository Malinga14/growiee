import { colors } from "@/config/theme";

/** Shared Recharts axis and grid styling. */
export const axisProps = {
  stroke: colors.line,
  tick: { fill: colors["ink-faint"], fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const;

export const gridProps = {
  stroke: colors["line-soft"],
  vertical: false,
} as const;
