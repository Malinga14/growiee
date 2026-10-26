import type { StoryProps } from "./templates/story";
import type { PipelineProps } from "./templates/pipeline";

// Each entry becomes its own composition in the Studio and a render target.
// `template` selects the concept (and its animations); `props` are typed to
// that template's schema. Add a video by adding an object here — to add a whole
// new *concept*, add a template under src/templates and register it in
// src/templates/index.ts.
export type VideoEntry =
  | { id: string; template: "story"; props: StoryProps }
  | { id: string; template: "pipeline"; props: PipelineProps };

export const videos: VideoEntry[] = [];
