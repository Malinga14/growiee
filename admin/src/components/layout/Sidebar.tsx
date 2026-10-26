"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/layout/Logo";
import { isActive, navigation } from "@/config/navigation";
import { useKeys } from "@/hooks/useKeys";
import { snappy, spring } from "@/lib/motion";

/** Rail width, and its gap from the window edge. */
export const SIDEBAR_WIDTH = 72;
export const SIDEBAR_INSET = 12;

type Tip = { label: string; hint?: string; y: number };

/**
 * Desktop navigation (phones use the tab bar), and the app's only chrome: a
 * floating liquid-glass pill: the logo mark, then bare page
 * icons. Only as tall as its contents and centred on the left edge. The
 * current page reads as an indigo icon with a small bar on the rail's edge that glides between
 * pages; names float out as tooltips on hover and focus.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const [tip, setTip] = useState<Tip | null>(null);
  const keys = useKeys();

  function show(label: string, hint: string | undefined) {
    return (e: React.SyntheticEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      setTip({ label, hint, y: r.top + r.height / 2 });
    };
  }

  return (
    <aside
      style={{ left: SIDEBAR_INSET, width: SIDEBAR_WIDTH }}
      className="liquid-glass fixed top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center overflow-hidden rounded-full py-3 lg:flex"
      onMouseLeave={() => setTip(null)}
    >
      <Link
        href="/"
        aria-label="Growiee Admin home"
        onMouseEnter={show("Growiee Admin", undefined)}
        onFocus={show("Growiee Admin", undefined)}
        onBlur={() => setTip(null)}
        className="pressable grid h-11 w-11 place-items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <LogoMark className="h-7" />
      </Link>
      <span aria-hidden="true" className="my-3 h-px w-6 bg-ink/10" />
      <nav aria-label="Sections" className="flex flex-col items-center">
        {navigation.map((section, i) => (
          <div key={section.title} className="flex flex-col items-center">
            {i > 0 && (
              <span aria-hidden="true" className="my-3 h-px w-6 bg-ink/10" />
            )}
            <ul className="flex flex-col items-center gap-1">
              {section.items.map((item) => {
                const active = isActive(item.href, pathname);
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <motion.span
                        layoutId="rail-active"
                        transition={spring}
                        aria-hidden="true"
                        className="absolute -left-[14px] top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                      />
                    )}
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      aria-keyshortcuts={`Alt+${item.shortcut} ${item.shortcut}`}
                      onMouseEnter={show(
                        item.label,
                        `${keys.alt} ${item.shortcut}`,
                      )}
                      onFocus={show(item.label, `${keys.alt} ${item.shortcut}`)}
                      onBlur={() => setTip(null)}
                      className={classNames(
                        "pressable grid h-11 w-11 place-items-center rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "text-primary"
                          : "text-ink-muted hover:text-primary",
                      )}
                    >
                      <Icon
                        icon={item.icon}
                        active={active}
                        className="h-[22px] w-[22px]"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Names float out as a tooltip. Portaled, because the rail clips
          its overflow to keep the glass edge clean. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {tip && (
              <motion.span
                key={tip.label}
                role="tooltip"
                initial={{ opacity: 0, x: -4, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -4, scale: 0.96 }}
                transition={snappy}
                style={{
                  top: tip.y,
                  left: SIDEBAR_INSET + SIDEBAR_WIDTH + 10,
                  transformOrigin: "left center",
                }}
                className="pointer-events-none fixed z-50 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-lg bg-ink py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-white shadow-lg"
              >
                {tip.label}
                {tip.hint && (
                  <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] tracking-wide">
                    {tip.hint}
                  </span>
                )}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </aside>
  );
}
