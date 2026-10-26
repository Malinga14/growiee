"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";
import { type DuoIcon, glyphs, Icon, icons } from "@/components/icons";
import Kbd from "@/components/layout/Kbd";
import { useScenario } from "@/components/ScenarioProvider";
import { navItems } from "@/config/navigation";
import { useKeys } from "@/hooks/useKeys";
import { snappy } from "@/lib/motion";

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  /** Keyboard shortcut shown on the right. */
  keys?: string[];
  icon: DuoIcon;
  run: () => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CommandPalette({ open, onClose }: Props) {
  return (
    <AnimatePresence>{open && <Palette onClose={onClose} />}</AnimatePresence>
  );
}

function Palette({ onClose }: Omit<Props, "open">) {
  const router = useRouter();
  const keys = useKeys();
  const { edited, reset } = useScenario();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...navItems.map((item) => ({
        id: `go:${item.href}`,
        group: "Go to",
        label: item.label,
        hint: item.description,
        keys: [keys.alt, item.shortcut],
        icon: item.icon,
        run: () => router.push(item.href),
      })),
      {
        id: "reset",
        group: "Assumptions",
        label: "Reset to brand & plan defaults",
        hint: edited ? "Undo every edit" : "Already on defaults",
        icon: icons.reset,
        run: reset,
      },
    ],
    [router, edited, reset, keys.alt],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function choose(command: Command | undefined) {
    if (!command) return;
    command.run();
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[60]" onKeyDown={onKeyDown}>
      <motion.div
        className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        initial={{ opacity: 0, scale: 0.96, y: -12, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.97, y: -8, filter: "blur(6px)" }}
        transition={snappy}
        style={{ transformOrigin: "top center" }}
        className="material relative mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-line shadow-[0_24px_60px_-16px_rgba(34,47,62,0.28)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon icon={icons.search} className="h-5 w-5 text-primary" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and actions…"
            aria-label="Search pages and actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={
              results[active] ? `cmd-${results[active].id}` : undefined
            }
            className="h-14 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
          />
          <Kbd>esc</Kbd>
        </div>

        <ul
          id="command-results"
          ref={listRef}
          role="listbox"
          className="no-scrollbar max-h-[50vh] overflow-y-auto p-2"
        >
          {results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-ink-muted">
              Nothing matches “{query}”.
            </li>
          )}
          {results.map((command, i) => {
            const showGroup = command.group !== lastGroup;
            lastGroup = command.group;
            const itemIcon = command.icon;
            const selected = i === active;
            return (
              <li key={command.id}>
                {showGroup && (
                  <p className="px-3 pb-1 pt-3 text-xs font-medium tracking-label text-ink-faint first:pt-1">
                    {command.group}
                  </p>
                )}
                <div
                  id={`cmd-${command.id}`}
                  role="option"
                  aria-selected={selected}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => choose(command)}
                  className="relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5"
                >
                  {selected && (
                    <motion.span
                      layoutId="palette-active"
                      transition={snappy}
                      className="absolute inset-0 rounded-lg bg-primary-soft"
                    />
                  )}
                  <span
                    className={classNames(
                      "relative grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors",
                      selected
                        ? "border-primary/20 bg-surface text-primary"
                        : "border-line text-ink-muted",
                    )}
                  >
                    <Icon
                      icon={itemIcon}
                      active={selected}
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {command.label}
                    </span>
                    {command.hint && (
                      <span className="block truncate text-xs text-ink-muted">
                        {command.hint}
                      </span>
                    )}
                  </span>
                  {selected ? (
                    <glyphs.enter
                      strokeWidth={2}
                      className="relative h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    command.keys && (
                      <span className="relative flex gap-0.5">
                        {command.keys.map((k) => (
                          <Kbd key={k}>{k}</Kbd>
                        ))}
                      </span>
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to move
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> to select
          </span>
        </div>
      </motion.div>
    </div>
  );
}
