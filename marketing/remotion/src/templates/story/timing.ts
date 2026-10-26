// Scene lengths for the "story" template (in frames @ FPS).
export const SCENE = {
  intro: 60,
  hook: 90,
  point: 66,
  cta: 84,
} as const;

// A story's length is derived from its data — add a point, the video grows.
export const totalDuration = (numPoints: number): number =>
  SCENE.intro + SCENE.hook + numPoints * SCENE.point + SCENE.cta;
