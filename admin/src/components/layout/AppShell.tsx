"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommandPalette from "@/components/layout/CommandPalette";
import Sidebar, {
  SIDEBAR_INSET,
  SIDEBAR_WIDTH,
} from "@/components/layout/Sidebar";
import TabBar from "@/components/layout/TabBar";
import MotionProvider from "@/components/motion/MotionProvider";
import { ScenarioProvider } from "@/components/ScenarioProvider";
import { navItems } from "@/config/navigation";

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    !!el &&
    (el.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <ScenarioProvider>
        <Shell>{children}</Shell>
      </ScenarioProvider>
    </MotionProvider>
  );
}

/**
 * No header: a floating glass sidebar is the only chrome on desktop, and a
 * glass tab bar on phones. Content is padded clear of the floating rail.
 */
function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function go(digit: string, e: KeyboardEvent) {
      const item = navItems.find((i) => i.shortcut === digit);
      if (!item) return false;
      e.preventDefault();
      router.push(item.href);
      return true;
    }

    function onKey(e: KeyboardEvent) {
      // Search: ⌘K on Mac, Ctrl+K on Windows/Linux.
      if (
        (e.metaKey || e.ctrlKey) &&
        !e.altKey &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      // Pages: ⌥1–7 / Alt+1–7, from anywhere (even while typing). Read the
      // physical key, since ⌥1 types "¡" on a Mac keyboard.
      const digit = /^Digit([1-9])$/.exec(e.code)?.[1];
      if (digit && e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        go(digit, e);
        return;
      }
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      // The number alone, when not typing in a field.
      if (digit && !e.shiftKey && go(digit, e)) return;
      if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    const onOpenSearch = () => setPaletteOpen(true);
    window.addEventListener("growiee:open-search", onOpenSearch);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("growiee:open-search", onOpenSearch);
    };
  }, [router]);

  return (
    <div
      className="brand-canvas min-h-screen"
      style={
        {
          "--sidebar-clear": `${SIDEBAR_WIDTH + SIDEBAR_INSET * 2}px`,
        } as React.CSSProperties
      }
    >
      <Sidebar />
      <div className="lg:pl-[var(--sidebar-clear)]">
        <Main>{children}</Main>
      </div>
      <TabBar />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}

/** Page content. */
function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full px-4 pb-32 pt-[calc(env(safe-area-inset-top)+12px)] sm:px-6 lg:px-8 lg:pb-12 lg:pt-6">
      {children}
    </main>
  );
}
