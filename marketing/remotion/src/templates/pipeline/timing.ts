// Scene lengths for the "pipeline" template (in frames @ FPS).
export const SCENE = {
  terminal: 96,
  statement: 96,
  // Code scene: a base beat plus time to type each line.
  codeBase: 36,
  codePerLine: 20,
  // Pipeline scene: a base beat plus a beat per stage.
  pipelineBase: 30,
  pipelinePerStep: 42,
  cta: 96,
} as const;

export const codeDuration = (numLines: number): number =>
  SCENE.codeBase + numLines * SCENE.codePerLine;

export const pipelineDuration = (numSteps: number): number =>
  SCENE.pipelineBase + numSteps * SCENE.pipelinePerStep;

// Total length is derived from the data — more code lines or stages → longer.
export const totalDuration = (numCodeLines: number, numSteps: number): number =>
  SCENE.terminal +
  SCENE.statement +
  codeDuration(numCodeLines) +
  pipelineDuration(numSteps) +
  SCENE.cta;
