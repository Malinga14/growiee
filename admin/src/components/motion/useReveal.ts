"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Cards rise into place as they scroll into view (GSAP ScrollTrigger.batch,
 * transform/opacity only). Works inside an independent scroll pane via
 * `scroller`. Only cards that start BELOW the fold are hidden first, so
 * nothing on screen ever flashes or waits for JavaScript; under reduced
 * motion nothing moves at all.
 */
export function useReveal(
  container: React.RefObject<HTMLElement>,
  scroller?: React.RefObject<HTMLElement>,
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = container.current;
        if (!root) return;
        const pane = scroller?.current ?? null;
        const bottom = pane
          ? pane.getBoundingClientRect().bottom
          : window.innerHeight;
        const cards = Array.from(
          root.querySelectorAll<HTMLElement>("[data-reveal]"),
        ).filter((el) => el.getBoundingClientRect().top > bottom - 24);
        if (!cards.length) return;
        gsap.set(cards, { autoAlpha: 0, y: 28, scale: 0.985 });
        ScrollTrigger.batch(cards, {
          scroller: pane ?? undefined,
          start: "top 92%",
          once: true,
          interval: 0.08,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.08,
              overwrite: true,
              clearProps: "transform",
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: container },
  );
}
