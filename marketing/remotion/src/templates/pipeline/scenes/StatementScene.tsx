import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../../brand";
import { HighlightBlock } from "../../../components/HighlightBlock";
import { SceneFrame } from "../../../components/SceneFrame";

// A bold positioning statement; the key phrase lands in the brand block.
export const StatementScene: React.FC<{
  eyebrow: string;
  statement: string;
  highlight: string;
  statementEnd: string;
}> = ({ eyebrow, statement, highlight, statementEnd }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowIn = spring({ frame, fps, config: { damping: 200 } });
  const lineIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const endIn = spring({ frame: frame - 40, fps, config: { damping: 200 } });

  return (
    <SceneFrame justify="center">
      <div
        style={{
          color: brand.green,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: eyebrowIn,
          transform: `translateY(${interpolate(eyebrowIn, [0, 1], [20, 0])}px)`,
          marginBottom: 40,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          color: brand.foreground,
          fontSize: 84,
          fontWeight: 600,
          lineHeight: 1.08,
          opacity: lineIn,
          transform: `translateY(${interpolate(lineIn, [0, 1], [30, 0])}px)`,
          marginBottom: 36,
        }}
      >
        {statement}
      </div>
      <HighlightBlock colorIndex={0} fontSize={118}>
        {highlight}
      </HighlightBlock>
      <div
        style={{
          color: brand.foreground,
          fontSize: 84,
          fontWeight: 600,
          lineHeight: 1.1,
          opacity: endIn,
          transform: `translateY(${interpolate(endIn, [0, 1], [24, 0])}px)`,
          marginTop: 40,
        }}
      >
        {statementEnd}
      </div>
    </SceneFrame>
  );
};
