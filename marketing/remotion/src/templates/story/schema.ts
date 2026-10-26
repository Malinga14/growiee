import { z } from "zod";

// The "story" concept: logo intro → cycling-word hook → value points → CTA.
// Editable live in the Remotion Studio sidebar.
export const storySchema = z.object({
  // Words cycled through the signature highlight block on the hook scene.
  hookWords: z.array(z.string()).min(1),
  // The single-line hook headline shown above the cycling words.
  headline: z.string(),
  // The value props, revealed one at a time.
  points: z
    .array(
      z.object({
        title: z.string(),
        body: z.string(),
      }),
    )
    .min(1),
  // Closing call to action.
  cta: z.string(),
  // Social handle shown on the outro.
  handle: z.string(),
});

export type StoryProps = z.infer<typeof storySchema>;
