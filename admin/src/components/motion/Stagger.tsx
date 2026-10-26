import classNames from "classnames";

/**
 * Reveals its children one after another: each rises, sharpens and fades in
 * (see `.stagger` in globals.css). Pure CSS, so it plays straight from the
 * server-rendered HTML — content never waits on JavaScript to appear.
 */
export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={classNames("stagger", className)}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
