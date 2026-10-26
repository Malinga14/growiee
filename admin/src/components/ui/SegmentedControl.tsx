"use client";

import { useId, useRef } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";
import { snappy } from "@/lib/motion";

type Option<T extends string> = { value: T; label: string; title?: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
};

/**
 * iOS-style segmented control. The thumb is a shared layout element, so it
 * springs between segments and re-targets mid-flight from wherever it is.
 */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: Props<T>) {
  const layoutId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const index = options.findIndex((o) => o.value === value);

  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    buttons.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="relative inline-flex rounded-lg bg-fill p-0.5"
    >
      {options.map((option, i) => {
        const selected = i === index;
        return (
          <motion.button
            key={option.value}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            title={option.title}
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.94 }}
            transition={snappy}
            className={classNames(
              "relative rounded-md font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
              size === "sm"
                ? "px-2.5 py-1 text-xs tracking-label"
                : "px-3.5 py-1.5 text-sm",
              selected ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                transition={snappy}
                className="absolute inset-0 rounded-md bg-surface shadow-thumb"
              />
            )}
            <span className="relative">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
