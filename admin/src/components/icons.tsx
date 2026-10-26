import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowDownRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowTurnBackwardIcon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  BabyBoyDressIcon,
  BalanceScaleIcon,
  Calculator01Icon,
  ChartIncreaseIcon,
  ChartLineData01Icon,
  CheckmarkCircle02Icon,
  CoinsDollarIcon,
  DashboardSquare01Icon,
  Delete02Icon,
  DeliveryReturn01Icon,
  DeliveryTruck01Icon,
  InformationCircleIcon,
  LeftToRightListBulletIcon,
  Invoice01Icon,
  Megaphone01Icon,
  MinusSignIcon,
  MoneyBag02Icon,
  MoreHorizontalIcon,
  PackageIcon,
  PaintBoardIcon,
  PaletteIcon,
  PercentIcon,
  PieChartIcon,
  RefreshIcon,
  Search01Icon,
  SidebarLeft01Icon,
  SlidersHorizontalIcon,
  SparklesIcon,
  Tag01Icon,
  TextFontIcon,
  Target02Icon,
  ViewIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

/**
 * The dashboard's icon set: Hugeicons Stroke Rounded (free, MIT). One crisp
 * 24px grid across every icon; "active" reads as a heavier stroke. Swap the
 * icon set by editing this file only.
 */
export type DuoIcon = IconSvgElement;

export const icons = {
  overview: DashboardSquare01Icon,
  unit: Calculator01Icon,
  pricing: Tag01Icon,
  production: PackageIcon,
  forecast: ChartLineData01Icon,
  breakeven: Target02Icon,
  assumptions: SlidersHorizontalIcon,
  search: Search01Icon,
  sidebar: SidebarLeft01Icon,
  more: MoreHorizontalIcon,
  info: InformationCircleIcon,
  reset: RefreshIcon,
  alert: AlertCircleIcon,
  check: CheckmarkCircle02Icon,
  coins: CoinsDollarIcon,
  bag: MoneyBag02Icon,
  wallet: Wallet01Icon,
  growth: ChartIncreaseIcon,
  percent: PercentIcon,
  pie: PieChartIcon,
  balance: BalanceScaleIcon,
  ads: Megaphone01Icon,
  delivery: DeliveryTruck01Icon,
  returns: DeliveryReturn01Icon,
  invoice: Invoice01Icon,
  baby: BabyBoyDressIcon,
  highlights: SparklesIcon,
  list: LeftToRightListBulletIcon,
  brand: PaintBoardIcon,
  palette: PaletteIcon,
  book: BookOpen01Icon,
  typography: TextFontIcon,
  trash: Delete02Icon,
  view: ViewIcon,
} satisfies Record<string, DuoIcon>;

/** Name of an icon — plain string, so it can cross from server to client components. */
export type IconName = keyof typeof icons;

type GlyphProps = {
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

function glyph(data: IconSvgElement) {
  function Glyph({ strokeWidth = 2, ...props }: GlyphProps) {
    return <HugeiconsIcon icon={data} strokeWidth={strokeWidth} {...props} />;
  }
  return Glyph;
}

/** Small inline glyphs: arrows, carets, keys. */
export const glyphs = {
  up: glyph(ArrowUpRight01Icon),
  down: glyph(ArrowDownRight01Icon),
  flat: glyph(MinusSignIcon),
  arrowRight: glyph(ArrowRight02Icon),
  caretDown: glyph(ArrowDown01Icon),
  caretRight: glyph(ArrowRight01Icon),
  caretLeft: glyph(ArrowLeft01Icon),
  enter: glyph(ArrowTurnBackwardIcon),
};

type Props = {
  /** An icon from `icons`, or its name. */
  icon: DuoIcon | IconName;
  /** Heavier stroke, for the selected or emphasised state. */
  active?: boolean;
  className?: string;
  strokeWidth?: number;
  "aria-label"?: string;
};

/** Renders an icon; decorative unless given an `aria-label`. */
export function Icon({ icon, active = false, strokeWidth, ...props }: Props) {
  const data = typeof icon === "string" ? icons[icon] : icon;
  return (
    <HugeiconsIcon
      icon={data}
      strokeWidth={strokeWidth ?? (active ? 2 : 1.6)}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    />
  );
}
