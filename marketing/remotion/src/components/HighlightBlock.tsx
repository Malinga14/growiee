import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, fontFamily, highlightColors } from "../brand";

// The signature Growthscope treatment: bold brand-yellow type sitting on a
// solid blue/green/pink block. Springs in with a slight overshoot.
export const HighlightBlock: React.FC<{
  children: React.ReactNode;
  colorIndex?: number;
  fontSize?: number;
}> = ({ children, colorIndex = 0, fontSize = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const rotate = interpolate(enter, [0, 1], [-4, -2]);

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: highlightColors[colorIndex % highlightColors.length],
        color: brand.yellow,
        fontFamily,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.05,
        padding: "0.08em 0.28em",
        borderRadius: 18,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </span>
  );
};

// Cycles through `words`, showing one at a time on a rotating highlight color.
export const CyclingHighlight: React.FC<{
  words: string[];
  framesPerWord?: number;
  fontSize?: number;
}> = ({ words, framesPerWord = 30, fontSize = 130 }) => {
  const frame = useCurrentFrame();
  const index = Math.floor(frame / framesPerWord) % words.length;
  const local = frame % framesPerWord;

  const opacity = interpolate(
    local,
    [0, 5, framesPerWord - 6, framesPerWord],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const translateY = interpolate(local, [0, 6], [26, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <span style={{ display: "inline-block", opacity, transform: `translateY(${translateY}px)` }}>
      <HighlightBlock colorIndex={index} fontSize={fontSize}>
        {words[index]}
      </HighlightBlock>
    </span>
  );
};
