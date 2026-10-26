import { defineTemplate } from "../types";
import { storySchema, type StoryProps } from "./schema";
import { StoryVideo } from "./StoryVideo";
import { totalDuration } from "./timing";

export const storyTemplate = defineTemplate<StoryProps>({
  schema: storySchema,
  Component: StoryVideo,
  // Length follows the data: more points → longer video.
  duration: (props) => totalDuration(props.points.length),
});

export type { StoryProps };
