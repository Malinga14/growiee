import classNames from "classnames";
import {
  MARK_EYE,
  MARK_PATHS,
  MARK_STROKE,
  MARK_VIEWBOX,
} from "@/components/layout/elephantMark";

/** The Growiee elephant, drawn from the master logo's strokes. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={classNames("h-7 w-auto shrink-0 text-primary", className)}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={MARK_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {MARK_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <circle {...MARK_EYE} fill="currentColor" />
    </svg>
  );
}

/** Wordmark: "Growiee" in Pacifico, flat Royal Indigo, as in the brand guidelines. */
export function Wordmark() {
  return (
    <span className="flex items-baseline gap-2 whitespace-nowrap">
      <span className="font-wordmark text-[24px] leading-none text-primary">
        Growiee
      </span>
      <span className="hidden text-[11px] font-semibold uppercase sm:inline tracking-[0.12em] text-ink-faint">
        Admin
      </span>
    </span>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <Wordmark />
    </span>
  );
}
