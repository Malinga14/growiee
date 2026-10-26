import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, fontFamily } from "../../../brand";
import { Logo } from "../../../components/Logo";

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 12, mass: 0.9 } });
  const markScale = interpolate(markIn, [0, 1], [0.3, 1]);

  const wordmarkIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const wordmarkOpacity = interpolate(wordmarkIn, [0, 1], [0, 1]);
  const wordmarkY = interpolate(wordmarkIn, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 60,
      }}
    >
      <div style={{ transform: `scale(${markScale})`, color: brand.foreground }}>
        <Logo variant="mark" width={300} />
      </div>
      <div style={{ opacity: wordmarkOpacity, transform: `translateY(${wordmarkY}px)` }}>
        <Logo variant="light" width={620} />
      </div>
    </AbsoluteFill>
  );
};
