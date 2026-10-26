"use client";

import { useEffect, useState } from "react";

/**
 * Height that makes an element fill the window from where it starts down to
 * the bottom (minus `bottom`, the page's own bottom padding), so the page
 * itself doesn't scroll. Only at or above `query`; null below it, so phones
 * keep a normal scrolling page.
 */
export function useFillHeight(
  ref: React.RefObject<HTMLElement>,
  { query = "(min-width: 1024px)", bottom = 48, min = 520 } = {},
) {
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fit = () => {
      const el = ref.current;
      if (!el || !mq.matches) return setHeight(null);
      let top = 0;
      for (
        let n: HTMLElement | null = el;
        n;
        n = n.offsetParent as HTMLElement | null
      )
        top += n.offsetTop;
      setHeight(Math.max(min, window.innerHeight - top - bottom));
    };
    fit();
    window.addEventListener("resize", fit);
    mq.addEventListener("change", fit);
    return () => {
      window.removeEventListener("resize", fit);
      mq.removeEventListener("change", fit);
    };
  }, [ref, query, bottom, min]);
  return height;
}
