import type React from "react";
import type { z } from "zod";

// A template is a self-contained video *concept*: its own editable schema, its
// own composition component (scenes + animations), and a data-driven length.
//
// Add a template to offer a new concept/animation set; add an entry in
// videos.ts to render a specific instance of it. The shared brand (colors,
// fonts, logo, highlight treatment) is reused across every template via
// src/brand.ts and src/components, so everything still looks like Growthscope.
export type TemplateModule<P> = {
  // zod schema = the props editable live in Remotion Studio + validated at build.
  schema: z.ZodType<P>;
  // The composition component for this concept.
  Component: React.FC<P>;
  // Length in frames, derived from the props so the video grows with its data.
  duration: (props: P) => number;
};

// Identity helper that keeps each template's props type bound to its schema.
export const defineTemplate = <P>(t: TemplateModule<P>): TemplateModule<P> => t;
