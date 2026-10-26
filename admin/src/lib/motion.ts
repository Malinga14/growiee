import type { Transition } from "framer-motion";

/**
 * Spring presets, in Apple's terms: critically damped (no bounce) for
 * everything that simply moves; a touch of bounce only where a gesture
 * carried momentum (a tap, a flick).
 */
export const spring: Transition = { type: "spring", bounce: 0, duration: 0.4 };
export const snappy: Transition = { type: "spring", bounce: 0, duration: 0.3 };
export const lively: Transition = {
  type: "spring",
  bounce: 0.25,
  duration: 0.45,
};

/** iOS sheet curve, for tweens that can't be springs (clip paths, path drawing). */
export const iosEase = [0.32, 0.72, 0, 1] as const;
