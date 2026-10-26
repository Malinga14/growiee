import { storyTemplate } from "./story";
import { pipelineTemplate } from "./pipeline";

// The template registry. Each key is a concept a video can be built on; each
// value bundles that concept's schema, component, and data-driven length.
// Add a template here and it becomes available to videos.ts immediately.
export const templates = {
  story: storyTemplate,
  pipeline: pipelineTemplate,
} as const;

export type TemplateId = keyof typeof templates;
