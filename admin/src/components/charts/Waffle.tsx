"use client";

import { useState } from "react";
import classNames from "classnames";
import Legend from "@/components/charts/Legend";
import { formatNumber, formatShare } from "@/lib/format";

export type WaffleGroup = {
  key: string;
  label: string;
  value: number;
  color: string;
};

/**
 * 10×10 waffle: every square is 1% of the run. Squares pop in row by row
 * (CSS, so it costs no JavaScript per frame); hovering a legend row lights
 * up that group's squares.
 */
export default function Waffle({
  groups,
  unit = "packs",
}: {
  groups: WaffleGroup[];
  unit?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const total = groups.reduce((t, g) => t + g.value, 0) || 1;

  // Largest-remainder rounding, so the grid is exactly 100 squares.
  const exact = groups.map((g) => (g.value / total) * 100);
  const counts = exact.map(Math.floor);
  let left = 100 - counts.reduce((a, b) => a + b, 0);
  exact
    .map((v, i) => ({ i, r: v - Math.floor(v) }))
    .sort((a, b) => b.r - a.r)
    .forEach(({ i }) => {
      if (left-- > 0) counts[i] += 1;
    });
  const cells = groups.flatMap((g, gi) =>
    Array.from({ length: counts[gi] }, () => g),
  );

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div
        role="img"
        aria-label={groups
          .map((g) => `${g.label} ${formatShare(g.value / total, 0)}`)
          .join(", ")}
        className="grid w-full max-w-[260px] shrink-0 grid-cols-10 gap-[3px] self-center"
      >
        {cells.map((g, i) => (
          <span
            key={i}
            className={classNames(
              "aspect-square animate-cell-in rounded-[5px] transition-opacity duration-200",
              active && active !== g.key && "opacity-20",
            )}
            style={{
              backgroundColor: g.color,
              animationDelay: `${Math.floor(i / 10) * 45 + (i % 10) * 12}ms`,
            }}
          />
        ))}
      </div>
      <Legend
        className="w-full min-w-0 flex-1"
        active={active}
        onHover={setActive}
        items={groups.map((g) => ({
          key: g.key,
          label: g.label,
          color: g.color,
          value: `${formatNumber(g.value)} ${unit}`,
          sub: formatShare(g.value / total, 0),
        }))}
      />
    </div>
  );
}
