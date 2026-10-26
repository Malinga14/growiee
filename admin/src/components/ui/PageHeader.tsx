"use client";

import Link from "next/link";
import { Icon, glyphs, icons } from "@/components/icons";
import { LogoMark } from "@/components/layout/Logo";
import Kbd from "@/components/layout/Kbd";
import { useScenario } from "@/components/ScenarioProvider";
import { findNavItem, sectionOf } from "@/config/navigation";
import { useKeys } from "@/hooks/useKeys";

/** Ask the app shell to open the search palette. */
export function openSearch() {
  window.dispatchEvent(new Event("growiee:open-search"));
}

/**
 * The top bar of every page: where you are (section › page) on the left,
 * search in the centre, and whether the numbers are the brand/plan defaults
 * on the right, on one line with no backdrop. Slim, so content starts high.
 */
export default function PageHeader({ href }: { href: string }) {
  const item = findNavItem(href);
  const section = sectionOf(item);
  const { edited, reset } = useScenario();
  const keys = useKeys();

  return (
    <header className="mb-6 grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,480px)_minmax(0,1fr)] lg:gap-4">
      {/* Where am I: section, then the page. */}
      <div className="flex min-w-0 items-center gap-2">
        <Link
          href="/"
          aria-label="Growiee Admin home"
          className="pressable grid h-10 w-10 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <LogoMark className="h-7" />
        </Link>
        <span
          className="mr-1 h-5 w-px shrink-0 bg-ink/10 lg:hidden"
          aria-hidden="true"
        />
        <span className="hidden shrink-0 text-sm font-medium text-ink-faint lg:inline">
          {section?.title}
        </span>
        <glyphs.caretRight
          className="hidden h-3.5 w-3.5 shrink-0 text-ink-faint lg:block"
          aria-hidden="true"
        />
        <Icon
          icon={item.icon}
          active
          className="h-5 w-5 shrink-0 text-primary"
        />
        <h1 className="truncate font-display text-[19px] font-extrabold leading-none tracking-title text-heading">
          {item.label}
        </h1>
      </div>

      <button
        type="button"
        onClick={openSearch}
        aria-label="Search pages and actions"
        aria-keyshortcuts={keys.mac ? "Meta+K" : "Control+K"}
        className="group hidden h-11 w-full items-center gap-3 rounded-full bg-white/80 px-4 text-sm text-ink-muted shadow-[0_1px_2px_rgba(34,47,62,0.04),0_8px_24px_-16px_rgba(45,52,141,0.25)] outline-none ring-1 ring-inset ring-ink/[0.06] transition-[background-color,box-shadow] hover:bg-white focus-visible:ring-2 focus-visible:ring-primary lg:flex"
      >
        <Icon
          icon={icons.search}
          className="h-[18px] w-[18px] shrink-0 transition-colors group-hover:text-primary"
        />
        <span className="flex-1 truncate text-left">
          Search pages and actions…
        </span>
        <span className="flex shrink-0 items-center gap-0.5">
          <Kbd>{keys.mod}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <div className="flex min-w-0 items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search pages and actions"
          className="pressable grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/80 text-ink-muted shadow-[0_1px_2px_rgba(34,47,62,0.04)] outline-none ring-1 ring-inset ring-ink/[0.06] hover:text-primary focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <Icon icon={icons.search} className="h-[18px] w-[18px]" />
        </button>
        {edited && (
          <button
            type="button"
            onClick={reset}
            className="h-9 shrink-0 rounded-full px-3 text-xs font-medium text-primary outline-none hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-primary"
          >
            Reset
          </button>
        )}
        <span
          title={edited ? "Edited assumptions" : "Brand & plan defaults"}
          className="flex h-10 min-w-0 items-center gap-2 rounded-full bg-white/80 px-3.5 text-xs font-medium text-ink-muted ring-1 ring-inset ring-ink/[0.06]"
        >
          <span
            className={
              "h-2 w-2 shrink-0 rounded-full " +
              (edited ? "bg-pink" : "bg-primary")
            }
            aria-hidden="true"
          />
          <span className="hidden truncate xl:inline">
            {edited ? "Edited assumptions" : "Brand & plan defaults"}
          </span>
          <span className="sr-only xl:hidden">
            {edited ? "Edited assumptions" : "Brand & plan defaults"}
          </span>
        </span>
      </div>
    </header>
  );
}
