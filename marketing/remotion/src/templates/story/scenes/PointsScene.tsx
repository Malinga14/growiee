import React from "react";
import { interpolate, Series, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../../brand";
import { HighlightBlock } from "../../../components/HighlightBlock";
import { SceneFrame } from "../../../components/SceneFrame";
import { SCENE } from "../timing";
import type { StoryProps } from "../schema";

const Point: React.FC<{
  index: number;
  point: StoryProps["points"][number];
}> = ({ index, point }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bodyIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const bodyY = interpolate(bodyIn, [0, 1], [40, 0]);

  return (
    <SceneFrame justify="center">
      <div
        style={{
          color: brand.foreground,
          fontSize: 48,
          fontWeight: 700,
          opacity: 0.5,
          marginBottom: 28,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <HighlightBlock colorIndex={index} fontSize={110}>
        {point.title}
      </HighlightBlock>
      <div
        style={{
          color: brand.foreground,
          fontSize: 64,
          fontWeight: 500,
          lineHeight: 1.2,
          marginTop: 44,
          opacity: bodyIn,
          transform: `translateY(${bodyY}px)`,
        }}
      >
        {point.body}
      </div>
    </SceneFrame>
  );
};

export const PointsScene: React.FC<{ points: StoryProps["points"] }> = ({ points }) => {
  return (
    <Series>
      {points.map((point, i) => (
        <Series.Sequence key={i} durationInFrames={SCENE.point}>
          <Point index={i} point={point} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
