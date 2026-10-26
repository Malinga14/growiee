import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../../brand";
import { SceneFrame } from "../../../components/SceneFrame";
import { Window } from "../../../components/Window";
import { Cursor, useTyped } from "../../../components/Typewriter";

const mono = '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Consolas, monospace';

// A command types itself into a terminal, then a success line confirms it.
export const TerminalIntro: React.FC<{
  prompt: string;
  command: string;
  result: string;
}> = ({ prompt, command, result }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowIn = spring({ frame, fps, config: { damping: 18, mass: 0.8 } });
  const windowScale = interpolate(windowIn, [0, 1], [0.92, 1]);

  const { shown, done } = useTyped(command, { start: 14, framesPerChar: 1.6 });
  const resultIn = spring({
    frame: frame - (14 + command.length * 1.6 + 8),
    fps,
    config: { damping: 200 },
  });

  return (
    <SceneFrame justify="center" align="center">
      <div style={{ transform: `scale(${windowScale})`, opacity: windowIn, width: "100%" }}>
        <Window title="growthscope — zsh" accent={brand.green}>
          <div style={{ fontFamily: mono, fontSize: 44, lineHeight: 1.5 }}>
            <div>
              <span style={{ color: brand.green }}>{prompt}</span>{" "}
              <span style={{ color: brand.foreground }}>{shown}</span>
              {!done ? <Cursor color={brand.foreground} /> : null}
            </div>
            <div
              style={{
                color: brand.green,
                marginTop: 24,
                opacity: resultIn,
                transform: `translateY(${interpolate(resultIn, [0, 1], [12, 0])}px)`,
              }}
            >
              <span style={{ fontWeight: 700 }}>✓</span> {result}
            </div>
          </div>
        </Window>
      </div>
    </SceneFrame>
  );
};
