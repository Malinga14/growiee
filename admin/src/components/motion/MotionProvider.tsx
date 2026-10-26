"use client";

import { MotionConfig } from "framer-motion";
import { spring } from "@/lib/motion";

/**
 * Springs by default, and `reducedMotion="user"` turns movement into simple
 * fades whenever the OS asks for reduced motion.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user" transition={spring}>
      {children}
    </MotionConfig>
  );
}
