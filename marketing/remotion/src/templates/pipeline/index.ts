import { defineTemplate } from "../types";
import { pipelineSchema, type PipelineProps } from "./schema";
import { PipelineVideo } from "./PipelineVideo";
import { totalDuration } from "./timing";

export const pipelineTemplate = defineTemplate<PipelineProps>({
  schema: pipelineSchema,
  Component: PipelineVideo,
  // Length follows the data: more code lines or stages → longer video.
  duration: (props) => totalDuration(props.codeLines.length, props.steps.length),
});

export type { PipelineProps };
