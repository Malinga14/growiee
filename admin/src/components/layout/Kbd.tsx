import classNames from "classnames";

export default function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={classNames(
        "inline-grid h-5 min-w-5 place-items-center rounded border border-line bg-surface px-1 font-sans text-[11px] font-medium text-ink-muted",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
