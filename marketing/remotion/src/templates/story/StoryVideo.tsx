import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { brand, fontFamily } from "../../brand";
import { Background } from "../../components/Background";
import { LogoIntro } from "./scenes/LogoIntro";
import { HookScene } from "./scenes/HookScene";
import { PointsScene } from "./scenes/PointsScene";
import { CtaScene } from "./scenes/CtaScene";
import { SCENE } from "./timing";
import type { StoryProps } from "./schema";

// Plays four scenes in sequence: LogoIntro → Hook → Points → Cta.
export const StoryVideo: React.FC<StoryProps> = ({
  hookWords,
  headline,
  points,
  cta,
  handle,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.background, fontFamily }}>
      <Background />
      <Series>
        <Series.Sequence durationInFrames={SCENE.intro}>
          <LogoIntro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.hook}>
          <HookScene headline={headline} hookWords={hookWords} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={points.length * SCENE.point}>
          <PointsScene points={points} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.cta}>
          <CtaScene cta={cta} handle={handle} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
