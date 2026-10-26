import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../../brand";
import { HighlightBlock } from "../../../components/HighlightBlock";
import { Logo } from "../../../components/Logo";
import { SceneFrame } from "../../../components/SceneFrame";
import { Cursor, useTyped } from "../../../components/Typewriter";

const mono = '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Consolas, monospace';

// Closing scene — terminal command types out, then the CTA and handle land.
export const CtaScene: React.FC<{ cta: string; handle: string }> = ({ cta, handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const command = "growthscope grow --sri-lanka";
  const { shown, done } = useTyped(command, { start: 18, framesPerChar: 1.4 });
  const handleIn = spring({ frame: frame - 56, fps, config: { damping: 200 } });

  return (
    <SceneFrame justify="center" align="center">
      <div style={{ opacity: logoIn, marginBottom: 56 }}>
        <Logo variant="light" width={540} />
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 40,
          marginBottom: 64,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <span style={{ color: brand.green }}>$</span> {shown}
        {!done ? <Cursor color={brand.foreground} /> : null}
      </div>
      <div style={{ textAlign: "center" }}>
        <HighlightBlock colorIndex={0} fontSize={92}>
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
          transform: `translateY(${interpolate(handleIn, [0, 1], [30, 0])}px)`,
        }}
      >
        {handle}
      </div>
    </SceneFrame>
  );
};
