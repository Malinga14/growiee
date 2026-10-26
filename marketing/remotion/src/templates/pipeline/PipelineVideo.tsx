import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { brand, fontFamily } from "../../brand";
import { GridBackground } from "../../components/GridBackground";
import { TerminalIntro } from "./scenes/TerminalIntro";
import { StatementScene } from "./scenes/StatementScene";
import { CodeScene } from "./scenes/CodeScene";
import { PipelineScene } from "./scenes/PipelineScene";
import { CtaScene } from "./scenes/CtaScene";
import { SCENE, codeDuration, pipelineDuration } from "./timing";
import type { PipelineProps } from "./schema";

// Terminal intro → statement → code editor → automation pipeline → CTA.
export const PipelineVideo: React.FC<PipelineProps> = ({
  terminal,
  eyebrow,
  statement,
  highlight,
  statementEnd,
  codeTitle,
  codeLines,
  pipelineTitle,
  steps,
  cta,
  handle,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.background, fontFamily }}>
      <GridBackground />
      <Series>
        <Series.Sequence durationInFrames={SCENE.terminal}>
          <TerminalIntro {...terminal} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.statement}>
          <StatementScene
            eyebrow={eyebrow}
            statement={statement}
            highlight={highlight}
            statementEnd={statementEnd}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={codeDuration(codeLines.length)}>
          <CodeScene codeTitle={codeTitle} codeLines={codeLines} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={pipelineDuration(steps.length)}>
          <PipelineScene pipelineTitle={pipelineTitle} steps={steps} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.cta}>
          <CtaScene cta={cta} handle={handle} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
