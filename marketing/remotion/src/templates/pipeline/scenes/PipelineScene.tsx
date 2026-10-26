import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../../../brand";
import { SceneFrame } from "../../../components/SceneFrame";
import { SCENE } from "../timing";
import type { PipelineProps } from "../schema";

const STAGE_COLORS = [brand.blue, brand.green, brand.pink, brand.yellow] as const;
const ROW_HEIGHT = 250;
const NODE = 110;

type Step = PipelineProps["steps"][number];

const Stage: React.FC<{ step: Step; index: number; isLast: boolean }> = ({
  step,
  index,
  isLast,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = STAGE_COLORS[index % STAGE_COLORS.length];

  // Each stage activates on its own beat.
  const start = SCENE.pipelineBase + index * SCENE.pipelinePerStep;
  const activate = spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.7 } });
  const nodeScale = interpolate(activate, [0, 1], [0.4, 1]);
  const active = frame >= start + 4;

  // The connector to the next stage draws after this node lands.
  const drawStart = start + 14;
  const draw = interpolate(frame, [drawStart, drawStart + SCENE.pipelinePerStep - 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const connectorH = ROW_HEIGHT - NODE;
  const numberDark = color === brand.yellow;

  return (
    <div style={{ display: "flex", gap: 44, height: ROW_HEIGHT, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: NODE }}>
        <div
          style={{
            width: NODE,
            height: NODE,
            borderRadius: "50%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 52,
            transform: `scale(${nodeScale})`,
            backgroundColor: active ? color : "transparent",
            border: `4px solid ${active ? color : "rgba(255,255,255,0.25)"}`,
            color: active ? (numberDark ? brand.background : "#fff") : "rgba(255,255,255,0.5)",
            boxShadow: active ? `0 0 50px ${color}88` : "none",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        {!isLast ? (
          <div style={{ position: "relative", width: 6, height: connectorH, marginTop: 4 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: 3,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${draw * 100}%`,
                backgroundColor: color,
                borderRadius: 3,
              }}
            />
            {/* Pulse riding the drawing edge. */}
            {draw > 0 && draw < 1 ? (
              <div
                style={{
                  position: "absolute",
                  top: `calc(${draw * 100}% - 11px)`,
                  left: "50%",
                  width: 22,
                  height: 22,
                  marginLeft: -11,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  boxShadow: `0 0 24px 6px ${color}`,
                }}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        style={{
          flex: 1,
          paddingTop: 8,
          opacity: activate,
          transform: `translateX(${interpolate(activate, [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{ color: brand.foreground, fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>
          {step.label}
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 40, fontWeight: 500, marginTop: 10 }}>
          {step.detail}
        </div>
      </div>
    </div>
  );
};

// The automation pipeline: stages light up in sequence, connected by a line
// that draws between them with a travelling pulse.
export const PipelineScene: React.FC<{ pipelineTitle: string; steps: Step[] }> = ({
  pipelineTitle,
  steps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <SceneFrame justify="center">
      <div
        style={{
          color: brand.yellow,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 70,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
        }}
      >
        {pipelineTitle}
      </div>
      {steps.map((step, i) => (
        <Stage key={i} step={step} index={i} isLast={i === steps.length - 1} />
      ))}
    </SceneFrame>
  );
};
