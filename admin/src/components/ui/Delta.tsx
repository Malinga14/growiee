import classNames from "classnames";
import { glyphs } from "@/components/icons";
import { formatPct } from "@/lib/format";

/** A signed percentage with an arrow, so direction never relies on colour alone. */
export default function Delta({
  value,
  pill = false,
  className,
}: {
  value: number;
  /** Tinted capsule, for headline numbers. */
  pill?: boolean;
  className?: string;
}) {
  const Glyph = value > 0 ? glyphs.up : value < 0 ? glyphs.down : glyphs.flat;
  return (
    <span
      className={classNames(
        "tabular inline-flex items-center gap-0.5 font-semibold",
        value > 0
          ? "text-gain-strong"
          : value < 0
            ? "text-loss-strong"
            : "text-ink-muted",
        pill && "rounded-full px-2 py-0.5",
        pill &&
          (value > 0 ? "bg-gain-soft" : value < 0 ? "bg-loss-soft" : "bg-fill"),
        className,
      )}
    >
      <Glyph
        strokeWidth={2.2}
        className="h-[0.85em] w-[0.85em]"
        aria-hidden="true"
      />
      {formatPct(value)}
    </span>
  );
}
