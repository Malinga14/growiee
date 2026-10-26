import classNames from "classnames";
import { Icon, type IconName, icons } from "@/components/icons";

const TONES = {
  primary: "bg-primary-soft text-primary ring-primary/15",
  violet: "bg-violet-soft text-violet-strong ring-violet/20",
  sky: "bg-sky-soft text-sky-strong ring-sky/25",
  pink: "bg-pink-soft text-pink-strong ring-pink/25",
  gain: "bg-gain-soft text-gain-strong ring-gain/20",
  loss: "bg-loss-soft text-loss-strong ring-loss/20",
  neutral: "bg-fill text-ink-muted ring-ink/5",
} as const;

export type Tone = keyof typeof TONES;

/**
 * A duotone icon seated in a tinted tile. The hairline inner ring and the
 * bright top edge read as light catching a surface — depth without shadows.
 */
export default function IconTile({
  icon,
  tone = "primary",
  size = "md",
  className,
}: {
  icon: IconName;
  tone?: Tone;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={classNames(
        "grid shrink-0 place-items-center ring-1 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]",
        size === "sm" ? "h-8 w-8 rounded-[9px]" : "h-10 w-10 rounded-xl",
        TONES[tone],
        className,
      )}
    >
      <Icon
        icon={icons[icon]}
        active
        className={size === "sm" ? "h-[18px] w-[18px]" : "h-[22px] w-[22px]"}
      />
    </span>
  );
}
