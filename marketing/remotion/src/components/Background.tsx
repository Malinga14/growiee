import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand, highlightColors } from "../brand";

// Drifting flat brand shapes over the neutral-900 base — echoes the
// site's generated BlogCover geometry, kept subtle behind the type.
const Shape: React.FC<{
  color: string;
  size: number;
  left: string;
  top: string;
  shape: "circle" | "square";
  speed: number;
}> = ({ color, size, left, top, shape, speed }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 240], [0, 40 * speed], {
    extrapolateRight: "extend",
  });
  const rotate = interpolate(frame, [0, 240], [0, 18 * speed]);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.16,
        borderRadius: shape === "circle" ? "50%" : 48,
        transform: `translateY(${y}px) rotate(${rotate}deg)`,
        filter: "blur(2px)",
      }}
    />
  );
};

export const Background: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.background, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${brand.neutral800} 0%, ${brand.background} 60%)`,
        }}
      />
      <Shape color={highlightColors[0]} size={420} left="-12%" top="8%" shape="circle" speed={1} />
      <Shape color={brand.yellow} size={260} left="72%" top="22%" shape="square" speed={-1.4} />
      <Shape color={highlightColors[2]} size={340} left="64%" top="74%" shape="circle" speed={1.6} />
      <Shape color={highlightColors[1]} size={220} left="-8%" top="78%" shape="square" speed={-1} />
    </AbsoluteFill>
  );
};
