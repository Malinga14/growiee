"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import classNames from "classnames";
import { Icon, icons } from "@/components/icons";
import { isActive, type NavItem, navItems } from "@/config/navigation";
import { lively, spring } from "@/lib/motion";

const MAX_TABS = 5;

/**
 * Phone navigation: a floating glass tab bar, iOS style. With more than five
 * tabs, the last slot becomes "More" and opens a sheet with the rest.
 */
export default function TabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const overflow = navItems.length > MAX_TABS;
  const tabs = overflow ? navItems.slice(0, MAX_TABS - 1) : navItems;
  const extra = overflow ? navItems.slice(MAX_TABS - 1) : [];
  const extraActive = extra.some((i) => isActive(i.href, pathname));

  return (
    <>
      <nav
        aria-label="Sections"
        className="liquid-glass fixed inset-x-3 bottom-5 z-40 rounded-[26px] lg:hidden"
        // Clear the home indicator on notched phones; bottom-5 is the fallback.
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
      >
        <ul
          className="grid p-1.5"
          style={{
            gridTemplateColumns: `repeat(${tabs.length + (overflow ? 1 : 0)}, minmax(0, 1fr))`,
          }}
        >
          {tabs.map((item) => {
            const active = isActive(item.href, pathname);
            const itemIcon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex flex-col items-center gap-0.5 rounded-xl py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {active && (
                    <motion.span
                      layoutId="tab-active"
                      transition={spring}
                      className="absolute inset-0 rounded-[18px] bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_8px_-2px_rgba(45,52,141,0.25)]"
                    />
                  )}
                  <motion.span
                    whileTap={{ scale: 0.82 }}
                    transition={lively}
                    className={classNames(
                      "relative",
                      active ? "text-primary" : "text-ink-muted",
                    )}
                  >
                    <Icon
                      icon={itemIcon}
                      active={active}
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </motion.span>
                  <span
                    className={classNames(
                      "relative text-[10px] font-medium",
                      active ? "text-primary-strong" : "text-ink-muted",
                    )}
                  >
                    {item.shortLabel ?? item.label}
                  </span>
                </Link>
              </li>
            );
          })}
          {overflow && (
            <li>
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                className={classNames(
                  "relative flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5",
                  extraActive ? "text-primary" : "text-ink-muted",
                )}
              >
                <Icon
                  icon={icons.more}
                  active={extraActive}
                  className="h-6 w-6"
                  aria-hidden="true"
                />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <MoreSheet
            onClose={() => setMoreOpen(false)}
            pathname={pathname}
            extra={extra}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MoreSheet({
  onClose,
  pathname,
  extra,
}: {
  onClose: () => void;
  pathname: string;
  extra: NavItem[];
}) {
  // Dismiss on a long enough drag, or a quick flick — velocity counts, not
  // just distance, so a short fast swipe closes it like a native sheet.
  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-ink/25 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-label="More sections"
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-line bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-3 lg:hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.6 }}
        onDragEnd={onDragEnd}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
        <ul className="space-y-1">
          {extra.map((item) => {
            const active = isActive(item.href, pathname);
            const itemIcon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={classNames(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-[15px]",
                    active
                      ? "bg-primary-soft font-medium text-primary-strong"
                      : "text-ink",
                  )}
                >
                  <Icon
                    icon={itemIcon}
                    active={active}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </>
  );
}
