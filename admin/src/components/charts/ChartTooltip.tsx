/** Shared tooltip chrome for every Recharts chart. */
export default function ChartTooltip({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: React.ReactNode; swatch?: string }[];
}) {
  return (
    <div className="liquid-glass rounded-xl px-3 py-2 text-sm">
      <p className="mb-1 text-xs text-ink-muted">{title}</p>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          {row.swatch && (
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: row.swatch }}
            />
          )}
          <span className="text-ink-muted">{row.label}</span>
          <span className="tabular ml-auto pl-3 font-medium">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
