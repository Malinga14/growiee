import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../../brand";
import { HighlightBlock } from "../../../components/HighlightBlock";
import { Logo } from "../../../components/Logo";
import { SceneFrame } from "../../../components/SceneFrame";

export const CtaScene: React.FC<{ cta: string; handle: string }> = ({ cta, handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const handleIn = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const handleY = interpolate(handleIn, [0, 1], [30, 0]);

  return (
    <SceneFrame justify="center" align="center">
      <div style={{ opacity: logoIn, marginBottom: 70 }}>
        <Logo variant="light" width={560} />
      </div>
      <div style={{ textAlign: "center" }}>
        <HighlightBlock colorIndex={2} fontSize={92}>
          {cta}
        </HighlightBlock>
      </div>
      <div
        style={{
          color: brand.foreground,
          fontSize: 56,
          fontWeight: 600,
          marginTop: 64,
          opacity: handleIn,
          transform: `translateY(${handleY}px)`,
        }}
      >
        {handle}
      </div>
    </SceneFrame>
  );
};
