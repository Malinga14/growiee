import React from "react";
import { useCurrentFrame } from "remotion";

// Reveals `text` one character at a time, starting at frame `start`.
// Returns the visible substring plus whether typing has finished.
export const useTyped = (
  text: string,
  { start = 0, framesPerChar = 1.4 }: { start?: number; framesPerChar?: number } = {},
): { shown: string; done: boolean } => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - start);
  const count = Math.min(text.length, Math.floor(elapsed / framesPerChar));
  return { shown: text.slice(0, count), done: count >= text.length };
};

// A blinking block cursor — the terminal/editor flavour for the pipeline concept.
export const Cursor: React.FC<{ color?: string; blink?: boolean }> = ({
  color = "currentColor",
  blink = true,
}) => {
  const frame = useCurrentFrame();
  const on = !blink || Math.floor(frame / 15) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.5em",
        marginLeft: "0.04em",
        backgroundColor: color,
        opacity: on ? 1 : 0,
        // Sit on the text baseline like a real caret.
        height: "0.95em",
        transform: "translateY(0.12em)",
        borderRadius: 2,
      }}
    />
  );
};
