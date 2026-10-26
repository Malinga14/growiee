"use client";

import { useEffect, useState } from "react";

/** True on Apple platforms (macOS, iPadOS), where shortcuts use ⌘ and ⌥. */
export function detectMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform = nav.userAgentData?.platform || nav.platform || "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

export type KeyLabels = {
  mac: boolean;
  /** The command key: ⌘ on Mac, Ctrl on Windows/Linux. */
  mod: string;
  /** The option key: ⌥ on Mac, Alt on Windows/Linux. */
  alt: string;
};

/**
 * Key names for this platform, for hints like "⌥ 3" / "Alt 3". Starts with
 * Mac labels (matching the static HTML) and corrects itself on mount.
 */
export function useKeys(): KeyLabels {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(detectMac()), []);
  return mac ? { mac, mod: "⌘", alt: "⌥" } : { mac, mod: "Ctrl", alt: "Alt" };
}
