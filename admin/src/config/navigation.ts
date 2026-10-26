import { type DuoIcon, icons } from "@/components/icons";

export type NavItem = {
  label: string;
  /** Used where space is tight (mobile tab bar). Defaults to `label`. */
  shortLabel?: string;
  href: string;
  icon: DuoIcon;
  /** Number key for this page: Alt/⌥ + number from anywhere, or the
   * number alone when not typing. Follows the sidebar order. */
  shortcut: string;
  /** Shown under the page title and in the command palette. */
  description: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

/**
 * Sidebar tabs. To add a tab: add an entry here and create the matching
 * route at `src/app/<href>/page.tsx`. The sidebar, mobile tab bar and
 * command palette all pick it up automatically.
 */
export const navigation: NavSection[] = [
  {
    title: "Business",
    items: [
      {
        label: "Overview",
        href: "/",
        icon: icons.overview,
        shortcut: "1",
        description:
          "How a LKR 2,000 3-Kit Pack turns into profit, at a glance.",
      },
      {
        label: "Unit Economics",
        shortLabel: "Unit",
        href: "/unit-economics",
        icon: icons.unit,
        shortcut: "2",
        description: "Every rupee of one order, from price to what's left.",
      },
      {
        label: "Pricing",
        href: "/pricing",
        icon: icons.pricing,
        shortcut: "3",
        description:
          "What each pack price earns, and the price a margin needs.",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Production",
        href: "/production",
        icon: icons.production,
        shortcut: "4",
        description: "Split a production run across sizes and cost it.",
      },
      {
        label: "Break-even",
        href: "/break-even",
        icon: icons.breakeven,
        shortcut: "5",
        description:
          "Orders a month that cover fixed costs, and what moves it.",
      },
      {
        label: "Forecast",
        href: "/forecast",
        icon: icons.forecast,
        shortcut: "6",
        description: "Month-by-month orders, profit and cash.",
      },
    ],
  },
  {
    title: "Identity",
    items: [
      {
        label: "Brand",
        href: "/brand",
        icon: icons.brand,
        shortcut: "7",
        description: "Guidelines, logo files, colours and type.",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Assumptions",
        href: "/assumptions",
        icon: icons.assumptions,
        shortcut: "8",
        description: "Every number the dashboard uses, and where it came from.",
      },
    ],
  },
];

export const navItems: NavItem[] = navigation.flatMap((s) => s.items);

export function findNavItem(href: string): NavItem {
  const item = navItems.find((i) => i.href === href);
  if (!item) throw new Error(`No navigation entry for ${href}`);
  return item;
}

export function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function activeNavItem(pathname: string): NavItem | undefined {
  return navItems.find((i) => isActive(i.href, pathname));
}

export function sectionOf(item: NavItem): NavSection | undefined {
  return navigation.find((s) => s.items.includes(item));
}
