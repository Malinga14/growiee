import React from "react";
import { Composition } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./timing";
import { templates } from "./templates";
import { videos } from "./videos";
import { GrowieeRoot } from "./growiee/Root";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {videos.map((video) => {
        // Look up the concept this video is built on. Each template brings its
        // own component, editable schema, and data-driven length.
        const template = templates[video.template];
        return (
          <Composition
            key={video.id}
            id={video.id}
            component={template.Component as React.FC<Record<string, unknown>>}
            schema={template.schema as never}
            defaultProps={video.props as never}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            // Length follows the data (see each template's `duration`).
            calculateMetadata={({ props }) => ({
              durationInFrames: template.duration(props as never),
            })}
          />
        );
      })}
      {/* GROWIEE social stills (also renderable alone via src/growiee/index.ts). */}
      <GrowieeRoot />
    </>
  );
};
