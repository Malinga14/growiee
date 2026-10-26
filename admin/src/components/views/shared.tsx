"use client";

import { useRef } from "react";
import classNames from "classnames";
import { Icon, type IconName } from "@/components/icons";
import { useReveal } from "@/components/motion/useReveal";
import { useFillHeight } from "@/hooks/useFillHeight";
import { formatMoney } from "@/lib/format";

/** A highlighted message: what the numbers mean, in one or two lines. */
export function Callout({
  tone = "info",
  icon,
  title,
  children,
}: {
  tone?: "info" | "warn" | "good";
  icon?: IconName;
  title: string;
  children?: React.ReactNode;
}) {
  const tones = {
    info: "border-primary/15 bg-primary-soft text-primary-strong",
    warn: "border-pink/40 bg-pink-soft text-pink-strong",
    good: "border-sky/40 bg-sky-soft text-sky-strong",
  } as const;
  return (
    <div
      className={classNames(
        "flex gap-3 rounded-2xl border p-4 sm:p-5",
        tones[tone],
      )}
    >
      <Icon
        icon={
          icon ??
          (tone === "warn" ? "alert" : tone === "good" ? "check" : "info")
        }
        active
        className="mt-0.5 h-5 w-5 shrink-0"
      />
      <div className="min-w-0 text-sm">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-1 text-ink-muted">{children}</div>}
      </div>
    </div>
  );
}

/** Coloured money: indigo when positive, rose when negative. */
export function Signed({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={classNames(
        "tabular",
        value < 0 ? "text-loss-strong" : "text-primary",
        className,
      )}
    >
      {formatMoney(value)}
    </span>
  );
}

/**
 * The calculator workspace: inputs on the left, results on the right. On
 * desktop it fills the window below the page title and each column scrolls
 * on its own, so the controls stay beside the charts they change; edges
 * fade instead of cutting off. Phones get one normal page scroll.
 */
export function Split({
  inputs,
  children,
}: {
  inputs: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const height = useFillHeight(ref);
  useReveal(ref, results);

  return (
    <div
      ref={ref}
      className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]"
      style={height ? { height } : undefined}
    >
      <div className="scroll-pane space-y-6">{inputs}</div>
      <div ref={results} className="scroll-pane min-w-0 space-y-6">
        {children}
      </div>
    </div>
  );
}

/** Simple key/value table row. */
export function KV({
  label,
  value,
  strong = false,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
      <span className={strong ? "font-semibold text-ink" : "text-ink-muted"}>
        {label}
      </span>
      <span
        className={classNames(
          "tabular whitespace-nowrap text-right",
          strong ? "font-semibold text-ink" : "text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}
