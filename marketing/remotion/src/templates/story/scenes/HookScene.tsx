import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../../brand";
import { CyclingHighlight } from "../../../components/HighlightBlock";
import { SceneFrame } from "../../../components/SceneFrame";

export const HookScene: React.FC<{ headline: string; hookWords: string[] }> = ({
  headline,
  hookWords,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineIn = spring({ frame, fps, config: { damping: 200 } });
  const headlineY = interpolate(headlineIn, [0, 1], [40, 0]);

  return (
    <SceneFrame justify="center">
      <div
        style={{
          color: brand.foreground,
          fontSize: 74,
          fontWeight: 600,
          lineHeight: 1.1,
          opacity: headlineIn,
          transform: `translateY(${headlineY}px)`,
          marginBottom: 50,
        }}
      >
        {headline}
      </div>
      <CyclingHighlight words={hookWords} fontSize={150} framesPerWord={26} />
    </SceneFrame>
  );
};
