import classNames from "classnames";

export type LegendItem = {
  key: string;
  label: string;
  color: string;
  value?: React.ReactNode;
  sub?: React.ReactNode;
};

/**
 * Legend with values: identity comes from the swatch beside the text, and
 * the text stays in ink, never the series colour.
 */
export default function Legend({
  items,
  active,
  onHover,
  className,
}: {
  items: LegendItem[];
  active?: string | null;
  onHover?: (key: string | null) => void;
  className?: string;
}) {
  return (
    <ul className={classNames("divide-y divide-ink/[0.06]", className)}>
      {items.map((it) => (
        <li
          key={it.key}
          onMouseEnter={() => onHover?.(it.key)}
          onMouseLeave={() => onHover?.(null)}
          className={classNames(
            "flex items-center gap-3 py-2.5 text-sm transition-opacity duration-200",
            active && active !== it.key && "opacity-40",
          )}
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
            style={{ backgroundColor: it.color }}
          />
          <span className="min-w-0 flex-1 text-ink-muted">
            {it.label}
            {it.sub && (
              <span className="ml-1.5 text-xs text-ink-faint">{it.sub}</span>
            )}
          </span>
          {it.value !== undefined && (
            <span className="tabular font-medium text-ink">{it.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
