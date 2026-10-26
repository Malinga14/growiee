"use client";

import { useEffect, useId, useState } from "react";
import classNames from "classnames";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  /** "lkr" shows a rupee prefix; "pct" edits 0.12 as 12 and shows %. */
  kind?: "lkr" | "pct" | "count";
  step?: number;
  min?: number;
  max?: number;
  /** Small line under the field, e.g. where the default came from. */
  hint?: React.ReactNode;
  /** Adds a range slider under the field. */
  slider?: { min: number; max: number; step?: number };
  className?: string;
};

/**
 * One assumption: a labelled number field (typed freely, committed when it
 * parses), with an optional slider for quick what-ifs. Percentages are shown
 * as whole numbers so "12" means 12%.
 */
export default function NumberField({
  label,
  value,
  onChange,
  kind = "lkr",
  step,
  min = 0,
  max,
  hint,
  slider,
  className,
}: Props) {
  const id = useId();
  const scale = kind === "pct" ? 100 : 1;
  const shown = round(value * scale);
  const [text, setText] = useState(String(shown));

  // Follow outside changes (reset, slider) unless the text already means it.
  useEffect(() => {
    if (Number(text) !== shown) setText(String(shown));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  function commit(raw: string) {
    setText(raw);
    const n = Number(raw.replace(/,/g, ""));
    if (raw.trim() === "" || !Number.isFinite(n)) return;
    const clamped = Math.max(
      min * scale,
      max === undefined ? n : Math.min(n, max * scale),
    );
    onChange(clamped / scale);
  }

  return (
    <div className={classNames("min-w-0", className)}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-ink-muted"
      >
        {label}
      </label>
      <div className="flex h-11 items-center rounded-xl border border-line bg-surface transition-shadow focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
        {kind === "lkr" && (
          <span className="pl-3 text-xs font-medium tracking-label text-ink-faint">
            LKR
          </span>
        )}
        <input
          id={id}
          inputMode="decimal"
          value={text}
          onChange={(e) => commit(e.target.value)}
          onBlur={() => setText(String(round(value * scale)))}
          className="tabular h-full w-full min-w-0 bg-transparent px-3 text-[15px] font-medium text-ink outline-none"
        />
        {kind === "pct" && (
          <span className="pr-3 text-sm text-ink-faint">%</span>
        )}
      </div>
      {slider && (
        <input
          type="range"
          aria-label={`${label} slider`}
          min={slider.min * scale}
          max={slider.max * scale}
          step={(slider.step ?? step ?? 1) * scale}
          value={shown}
          onChange={(e) => commit(e.target.value)}
          className="brand-range mt-3 w-full"
        />
      )}
      {hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
