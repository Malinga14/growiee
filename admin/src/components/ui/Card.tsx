import classNames from "classnames";
import type { IconName } from "@/components/icons";
import IconTile, { type Tone } from "@/components/ui/IconTile";

type Props = {
  title?: string;
  icon?: IconName;
  iconTone?: Tone;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  title,
  icon,
  iconTone = "primary",
  subtitle,
  actions,
  children,
  className,
}: Props) {
  return (
    <section
      data-reveal
      className={classNames(
        "glass-card min-w-0 rounded-[24px] p-5 sm:p-6",
        className,
      )}
    >
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {icon && <IconTile icon={icon} tone={iconTone} size="sm" />}
            <div className="min-w-0">
              {title && (
                <h2 className="text-[17px] font-semibold tracking-title text-ink">
                  {title}
                </h2>
              )}
              {subtitle && (
                <div className="mt-1 text-sm text-ink-muted">{subtitle}</div>
              )}
            </div>
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
