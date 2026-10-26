"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Width of an element, kept current with a ResizeObserver, so SVG charts
 * draw at real pixel sizes (crisp hairlines, undistorted text) instead of
 * scaling a fixed viewBox.
 */
export function useWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}
