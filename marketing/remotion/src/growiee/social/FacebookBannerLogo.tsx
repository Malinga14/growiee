import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { fonts, growiee } from "../brand";
import { MARK_EYE, MARK_PATHS, MARK_STROKE, MARK_VIEWBOX } from "../logos/logoMark";

// Logo-only Facebook covers (1640 x 624): no photography, just the elephant
// mark, the wordmark and the palette. The mark is only ever scaled, cropped by
// the canvas edge or repeated; never rotated, outlined or recoloured off-palette.
// Copy keeps to the same safe area as the other covers (x 300-1375).

loadNunito("normal", { weights: ["300", "400"] });

const [, , VB_W, VB_H] = MARK_VIEWBOX.split(" ").map(Number);

// The mark at its true aspect ratio, so `width` is the drawn width and the
// bottom of the box is the bottom of the feet.
export const MarkShape: React.FC<{ color: string; width: number; style?: React.CSSProperties }> = ({
  color,
  width,
  style,
}) => (
  <svg width={width} height={(width * VB_H) / VB_W} viewBox={MARK_VIEWBOX} style={{ display: "block", ...style }}>
    <g fill="none" stroke={color} strokeWidth={MARK_STROKE} strokeLinecap="round" strokeLinejoin="round">
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
    <circle {...MARK_EYE} fill={color} />
  </svg>
);

export const Lockup: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.2 }}>
    <MarkShape color={color} width={size} />
    <div style={{ fontFamily: fonts.wordmark, fontSize: size * 0.62, lineHeight: 1, color, marginTop: -size * 0.12 }}>
      Growiee
    </div>
  </div>
);

const caps: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
};

const headline: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 300,
  fontSize: 48,
  lineHeight: 1.12,
  letterSpacing: "-0.01em",
  whiteSpace: "pre-line",
};

// 1 · Supergraphic: one giant mark, tone-on-tone, bleeding off the right edge.
export const BannerSupergraphic: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.indigo, overflow: "hidden" }}>
    <MarkShape
      color={growiee.indigoDeep}
      width={1180}
      style={{ position: "absolute", left: 860, top: -170 }}
    />
    <div style={{ position: "absolute", left: 300, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Lockup color={growiee.silk} size={110} />
      <div style={{ ...headline, color: growiee.silk, marginTop: 40 }}>Gentle First Steps.</div>
      <div style={{ fontFamily: fonts.sans, fontSize: 21, color: "rgba(253,253,253,0.78)", marginTop: 10 }}>
        Comfort that grows with them.
      </div>
      <div style={{ ...caps, color: growiee.sky, marginTop: 30 }}>Newborn to 9 months · growiee.com</div>
    </div>
  </AbsoluteFill>
);

// 2 · Growth: four marks on one baseline, growing through the four sizes.
const SIZES = [
  { label: "NB", width: 78 },
  { label: "0–3M", width: 112 },
  { label: "3–6M", width: 150 },
  { label: "6–9M", width: 192 },
];
export const BannerGrowth: React.FC = () => {
  const baseline = 438;
  const gap = 30;
  const rowLeft = 770;
  let x = rowLeft;
  const placed = SIZES.map((s) => {
    const p = { ...s, left: x };
    x += s.width + gap;
    return p;
  });
  const rowRight = x - gap;
  return (
    <AbsoluteFill style={{ background: growiee.silk }}>
      {/* Baseline the marks stand on */}
      <div
        style={{
          position: "absolute",
          left: rowLeft - 24,
          width: rowRight - rowLeft + 48,
          top: baseline + 16,
          height: 2,
          borderRadius: 1,
          background: growiee.pink,
        }}
      />
      {placed.map((s) => (
        <React.Fragment key={s.label}>
          <MarkShape
            color={growiee.indigo}
            width={s.width}
            style={{ position: "absolute", left: s.left, top: baseline - (s.width * VB_H) / VB_W }}
          />
          <div
            style={{
              ...caps,
              letterSpacing: "0.16em",
              color: growiee.indigo,
              position: "absolute",
              top: baseline + 36,
              left: s.left,
              width: s.width,
              textAlign: "center",
            }}
          >
            {s.label}
          </div>
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: 300, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Lockup color={growiee.indigo} size={88} />
        <div style={{ ...headline, color: growiee.indigo, marginTop: 38 }}>{"Comfort that\ngrows with them."}</div>
        <div style={{ ...caps, color: growiee.indigo, opacity: 0.72, marginTop: 26 }}>Newborn to 9 months</div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · Pattern: a gift-wrap repeat of the mark on Soft Violet, with a clear
// centre panel holding the lockup.
export const BannerPattern: React.FC = () => {
  const tile = { w: 150, h: 128, mark: 58 };
  const markH = (tile.mark * VB_H) / VB_W;
  const panel = { w: 860, h: 336 };
  const clear = { left: (1640 - panel.w) / 2, top: (624 - panel.h) / 2, right: (1640 + panel.w) / 2, bottom: (624 + panel.h) / 2 };
  const marks: { x: number; y: number }[] = [];
  for (let row = -1; row * tile.h < 624 + tile.h; row++) {
    const offset = row % 2 === 0 ? 0 : tile.w / 2;
    for (let col = -1; col * tile.w < 1640 + tile.w; col++) {
      const x = col * tile.w + offset;
      const y = row * tile.h + 34;
      // Leave whole marks out of the clear centre rather than cutting them.
      const overlaps = x < clear.right && x + tile.mark > clear.left && y < clear.bottom && y + markH > clear.top;
      if (!overlaps) marks.push({ x, y });
    }
  }
  return (
    <AbsoluteFill style={{ background: growiee.violet, overflow: "hidden" }}>
      {marks.map((m, i) => (
        <MarkShape
          key={i}
          color="rgba(253,253,253,0.16)"
          width={tile.mark}
          style={{ position: "absolute", left: m.x, top: m.y }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: (1640 - panel.w) / 2,
          top: (624 - panel.h) / 2,
          width: panel.w,
          height: panel.h,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Lockup color={growiee.silk} size={136} />
        <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: 24, color: growiee.silk, marginTop: 22 }}>
          Gentle First Steps. Comfort That Grows With Them.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const logoBannerSet = [
  { id: "supergraphic", component: BannerSupergraphic },
  { id: "growth", component: BannerGrowth },
  { id: "pattern", component: BannerPattern },
] as const;
