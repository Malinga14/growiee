"use client";

import { motion } from "framer-motion";
import classNames from "classnames";
import { spring } from "@/lib/motion";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type Props = {
  /** Already-formatted text, e.g. "1,332,450". */
  text: string;
  /** False while scrubbing: digits must follow the pointer 1:1, not roll. */
  animate?: boolean;
  className?: string;
};

/**
 * Odometer-style number: each digit rolls to its new value on its own
 * spring. Digits are keyed from the right, so 999 → 1,000 adds a column on
 * the left instead of reshuffling every digit.
 */
export default function RollingNumber({
  text,
  animate = true,
  className,
}: Props) {
  const chars = text.split("");
  return (
    <span
      aria-label={text}
      role="text"
      className={classNames("tabular inline-flex", className)}
    >
      {chars.map((char, i) => {
        const key = chars.length - i;
        if (!/\d/.test(char)) {
          return (
            <span
              key={`s${key}`}
              aria-hidden="true"
              className="inline-block"
              style={{ height: "1.15em", lineHeight: "1.15em" }}
            >
              {char}
            </span>
          );
        }
        return (
          <span
            key={`d${key}`}
            aria-hidden="true"
            className="relative inline-block overflow-hidden"
            style={{
              height: "1.15em",
              lineHeight: "1.15em",
              maskImage:
                "linear-gradient(transparent, #000 18%, #000 82%, transparent)",
              WebkitMaskImage:
                "linear-gradient(transparent, #000 18%, #000 82%, transparent)",
            }}
          >
            {/* Invisible digit reserves the column width. */}
            <span className="invisible">0</span>
            <motion.span
              className="absolute inset-x-0 top-0 flex flex-col"
              initial={false}
              animate={{ y: `${-Number(char) * 1.15}em` }}
              transition={
                animate ? { ...spring, delay: i * 0.025 } : { duration: 0 }
              }
            >
              {DIGITS.map((d) => (
                <span key={d} style={{ height: "1.15em" }}>
                  {d}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
