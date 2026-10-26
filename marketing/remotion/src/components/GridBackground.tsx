import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";

// A slowly scrolling "blueprint" grid with a faint brand glow. Distinct from
// the story template's drifting shapes — this is the engineering/code mood
// used by the pipeline concept.
export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // Scroll the grid upward one cell over time for a subtle sense of motion.
  const offset = interpolate(frame, [0, 120], [0, 90], { extrapolateRight: "extend" }) % 90;
  const glow = interpolate(frame, [0, 120, 240], [0.18, 0.32, 0.18], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: brand.background, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          transform: `translateY(${-offset}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 50% at 50% 22%, ${brand.blue}00 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 78% 12%, ${brand.green} 0%, transparent 55%)`,
          opacity: glow * 0.5,
          filter: "blur(40px)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 20% 88%, ${brand.pink} 0%, transparent 55%)`,
          opacity: glow * 0.4,
          filter: "blur(40px)",
        }}
      />
      {/* Keep the base readable behind type. */}
      <AbsoluteFill style={{ backgroundColor: "rgba(10,10,12,0.35)" }} />
    </AbsoluteFill>
  );
};
