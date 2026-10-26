"use client";

import { motion } from "framer-motion";
import type { IconName } from "@/components/icons";
import IconTile, { type Tone } from "@/components/ui/IconTile";
import Sparkline from "@/components/ui/Sparkline";
import { spring } from "@/lib/motion";

type Props = {
  label: string;
  icon?: IconName;
  tone?: Tone;
  value: React.ReactNode;
  detail?: React.ReactNode;
  /** Prices to draw as a sparkline under the figures. */
  trend?: number[];
  /** Staggers the sparkline draw across a row of tiles. */
  index?: number;
};

export default function StatTile({
  icon,
  tone = "primary",
  label,
  value,
  detail,
  trend,
  index = 0,
}: Props) {
  return (
    <motion.div
      data-reveal
      whileHover={{ y: -3 }}
      transition={spring}
      className="glass-card group min-w-0 rounded-[22px] p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="pt-1 text-[13px] font-medium tracking-label text-ink-muted">
          {label}
        </p>
        {icon && <IconTile icon={icon} tone={tone} size="sm" />}
      </div>
      <div className="tabular mt-2 truncate text-lg font-semibold sm:text-[22px] leading-tight tracking-title text-ink">
        {value}
      </div>
      {detail && (
        <div className="tabular mt-1 truncate text-sm text-ink-muted">
          {detail}
        </div>
      )}
      {trend && (
        <Sparkline
          values={trend}
          delay={0.3 + index * 0.08}
          className="mt-4 h-10 w-full"
        />
      )}
    </motion.div>
  );
}
