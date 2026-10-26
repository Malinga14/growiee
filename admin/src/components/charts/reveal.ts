import { iosEase } from "@/lib/motion";

/**
 * Charts draw once, when they scroll into view. Only transform, opacity
 * and stroke drawing animate (compositor-friendly); MotionProvider's
 * reducedMotion="user" turns movement into simple fades.
 */
export const inView = { once: true, amount: 0.35 } as const;

export function drawIn(delay = 0) {
  return { duration: 0.9, ease: iosEase, delay };
}

export function growIn(delay = 0) {
  return { type: "spring" as const, bounce: 0, duration: 0.7, delay };
}
