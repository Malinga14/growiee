import { z } from "zod";

// The "pipeline" concept: a terminal/code-editor take on Growthscope's
// "marketing as code" positioning — typewriter intro, a literal config file
// that types itself out, and an animated automation pipeline.
export const pipelineSchema = z.object({
  // Terminal intro: prompt + the command that types itself + the success line.
  terminal: z.object({
    prompt: z.string(),
    command: z.string(),
    result: z.string(),
  }),
  // Big statement scene. The highlight phrase gets the brand block treatment.
  eyebrow: z.string(),
  statement: z.string(),
  highlight: z.string(),
  statementEnd: z.string(),
  // Code-editor scene: filename + the lines that type out, top to bottom.
  codeTitle: z.string(),
  codeLines: z.array(z.string()),
  // Automation pipeline: a title and the ordered stages that light up in turn.
  pipelineTitle: z.string(),
  steps: z
    .array(
      z.object({
        label: z.string(),
        detail: z.string(),
      }),
    )
    .min(1),
  // Closing call to action + social handle.
  cta: z.string(),
  handle: z.string(),
});

export type PipelineProps = z.infer<typeof pipelineSchema>;
