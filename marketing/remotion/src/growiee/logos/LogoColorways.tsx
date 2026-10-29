import React from "react";
import { AbsoluteFill } from "remotion";
import { fonts, growiee } from "../brand";
import { MARK_EYE, MARK_PATHS, MARK_STROKE, MARK_VIEWBOX } from "./logoMark";

// Colour explorations of the current Growiee mark: same shape, new mark and
// background colours. One 1080 x 1080 still per colourway plus an overview.
export const COLORWAY_SIZE = 1080;
export const COLORWAY_OVERVIEW_WIDTH = 2400;
export const COLORWAY_OVERVIEW_HEIGHT = 1350;

export type Colorway = {
  id: string;
  name: string;
  mark: string;
  background: string;
};

export const colorways: Colorway[] = [
  { id: "silk-on-indigo", name: "Silk on Royal Indigo", mark: growiee.silk, background: growiee.indigo },
  { id: "indigo-on-petal-pink", name: "Indigo on Petal Pink", mark: growiee.indigo, background: growiee.pink },
  { id: "champagne-on-midnight", name: "Champagne on Midnight", mark: "#D4B47C", background: "#151A3D" },
  { id: "pink-on-plum", name: "Pink on Plum", mark: growiee.pink, background: "#4A2545" },
  { id: "forest-on-sage-mist", name: "Forest on Sage Mist", mark: "#2F4A3A", background: "#DCE5DA" },
  { id: "ivory-on-sage", name: "Ivory on Sage", mark: "#F6F1E7", background: "#5F7A64" },
  { id: "terracotta-on-linen", name: "Terracotta on Linen", mark: "#A65A3E", background: "#F3EBDF" },
  { id: "silk-on-violet", name: "Silk on Soft Violet", mark: growiee.silk, background: growiee.violet },
  { id: "cocoa-on-oat", name: "Cocoa on Oat", mark: "#5A4034", background: "#EFE6D8" },
  { id: "charcoal-on-stone", name: "Charcoal on Stone", mark: "#232220", background: "#E9E4DA" },
];

export const Mark: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox={MARK_VIEWBOX} style={{ display: "block" }}>
    <g fill="none" stroke={color} strokeWidth={MARK_STROKE} strokeLinecap="round" strokeLinejoin="round">
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
    <circle {...MARK_EYE} fill={color} />
  </svg>
);

export const LogoColorway: React.FC<{ index: number }> = ({ index }) => {
  const c = colorways[index];
  return (
    <AbsoluteFill style={{ background: c.background, alignItems: "center", justifyContent: "center" }}>
      <Mark color={c.mark} size={COLORWAY_SIZE * 0.5} />
    </AbsoluteFill>
  );
};

export const LogoColorwayOverview: React.FC = () => {
  const pad = 64;
  const gap = 20;
  const head = 184;
  const cols = 5;
  const tileW = (COLORWAY_OVERVIEW_WIDTH - pad * 2 - gap * (cols - 1)) / cols;
  const tileH = (COLORWAY_OVERVIEW_HEIGHT - head - gap - pad) / 2;
  return (
    <AbsoluteFill style={{ background: growiee.silk }}>
      <div
        style={{
          position: "absolute",
          left: pad,
          top: pad - 6,
          fontFamily: fonts.wordmark,
          fontSize: 60,
          color: growiee.indigo,
        }}
      >
        Growiee
      </div>
      <div
        style={{
          position: "absolute",
          right: pad,
          top: pad + 22,
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: 18,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: growiee.indigo,
        }}
      >
        Logo colour versions
      </div>
      {colorways.map((c, i) => (
        <div
          key={c.id}
          style={{
            position: "absolute",
            left: pad + (i % cols) * (tileW + gap),
            top: head + Math.floor(i / cols) * (tileH + gap),
            width: tileW,
            height: tileH,
            background: c.background,
            borderRadius: 18,
            border: "1px solid rgba(0,4,13,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mark color={c.mark} size={tileH * 0.46} />
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 18,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: fonts.sans,
              fontSize: 15,
              fontWeight: 500,
              color: c.mark,
            }}
          >
            <span>
              {String(i + 1).padStart(2, "0")} · {c.name}
            </span>
            <span style={{ opacity: 0.8 }}>
              {c.mark.toUpperCase()} / {c.background.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
