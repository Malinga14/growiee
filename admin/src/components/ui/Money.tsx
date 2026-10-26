"use client";

import RollingNumber from "@/components/motion/RollingNumber";
import { CURRENCY, formatMoney } from "@/lib/format";

/** A large amount with the currency code set small, so the digits lead. */
export default function Money({
  value,
  rolling = true,
}: {
  value: number;
  /** Roll digits when the value changes (e.g. editing an assumption). */
  rolling?: boolean;
}) {
  const text = formatMoney(value, false);
  return (
    <span className="tabular inline-flex items-baseline">
      <span className="mr-1 text-[0.6em] font-medium tracking-label text-ink-muted">
        {CURRENCY}
      </span>
      {rolling ? <RollingNumber text={text} /> : text}
    </span>
  );
}
