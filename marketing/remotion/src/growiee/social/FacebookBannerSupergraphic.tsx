import React from "react";
import { AbsoluteFill } from "remotion";
import { noise2D } from "@remotion/noise";
import { fonts, growiee } from "../brand";
import { MARK_EYE, MARK_PATHS, MARK_STROKE, MARK_VIEWBOX } from "../logos/logoMark";
import { Lockup } from "./FacebookBannerLogo";

// Supergraphic cover, refined (v10). Colour plan, 60 / 30 / 10:
// - 60  Royal Indigo field (cool, calm base).
// - 30  analogous tones: the giant mark runs violet-cast indigo -> deep indigo, with
//       a soft violet light on the right only (never behind the lockup).
// - 10  warm complement: Petal Pink for the label, rule and two seed dots,
//       plus Off-White Silk type.
// Background details stay whisper-quiet: ripple rings from the mark's eye,
// a few "cotton seed" dots and a fine grain.

const W = 1640;
const H = 624;

const [VB_X, VB_Y, VB_W, VB_H] = MARK_VIEWBOX.split(" ").map(Number);

// Giant mark placement (same framing as v9).
const GIANT = { left: 860, top: -170, width: 1180 };
const scale = GIANT.width / VB_W;
const eye = {
  x: GIANT.left + (MARK_EYE.cx - VB_X) * scale,
  y: GIANT.top + (MARK_EYE.cy - VB_Y) * scale,
};

const caps: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
};

// Seed dots: [angle in degrees around the eye, ring radius, dot radius, colour]
const SEEDS: [number, number, number, string][] = [
  [205, 150, 3, "rgba(253,253,253,0.55)"],
  [250, 225, 2.5, "rgba(253,253,253,0.4)"],
  [160, 225, 4, growiee.pink],
  [120, 310, 2.5, "rgba(253,253,253,0.35)"],
  [228, 310, 3, "rgba(253,253,253,0.45)"],
  [150, 310, 3, growiee.pink],
];
const RINGS = [95, 150, 225, 310];

export const BannerSupergraphicV2: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.indigo, overflow: "hidden" }}>
    {/* Soft analogous light, right side only */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(720px 520px at 1420px 120px, rgba(108,92,231,0.30), rgba(108,92,231,0) 70%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(640px 420px at 1180px 640px, rgba(32,38,110,0.55), rgba(32,38,110,0) 70%)`,
      }}
    />

    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        {/* One gradient across the whole mark, not per path */}
        <linearGradient
          id="giant"
          gradientUnits="userSpaceOnUse"
          x1={VB_X + VB_W}
          y1={VB_Y}
          x2={VB_X}
          y2={VB_Y + VB_H}
        >
          {/* Always a shade deeper than the field, with a violet cast up top */}
          <stop offset="0" stopColor="#2A2A86" />
          <stop offset="0.5" stopColor="#242A79" />
          <stop offset="1" stopColor={growiee.indigoDeep} />
        </linearGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Ripple rings spreading from the giant eye */}
      {RINGS.map((r, i) => (
        <circle
          key={r}
          cx={eye.x}
          cy={eye.y}
          r={r}
          fill="none"
          stroke={growiee.silk}
          strokeOpacity={0.1 - i * 0.015}
          strokeWidth={1}
        />
      ))}

      {/* The giant mark: scaled and cropped only, gradient within the palette */}
      <g transform={`translate(${GIANT.left} ${GIANT.top}) scale(${scale}) translate(${-VB_X} ${-VB_Y})`}>
        <g fill="none" stroke="url(#giant)" strokeWidth={MARK_STROKE} strokeLinecap="round" strokeLinejoin="round">
          {MARK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <circle {...MARK_EYE} fill="url(#giant)" />
      </g>

      {/* Cotton-seed dots resting on the rings */}
      {SEEDS.map(([deg, ring, r, color], i) => {
        const a = (deg * Math.PI) / 180;
        return <circle key={i} cx={eye.x + ring * Math.cos(a)} cy={eye.y + ring * Math.sin(a)} r={r} fill={color} />;
      })}

      {/* Fine paper grain */}
      <rect width={W} height={H} filter="url(#grain)" opacity={0.05} style={{ mixBlendMode: "overlay" }} />
    </svg>

    <div style={{ position: "absolute", left: 300, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Lockup color={growiee.silk} size={110} />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 300,
          fontSize: 50,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: growiee.silk,
          marginTop: 40,
        }}
      >
        Gentle First Steps.
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: 21, color: "rgba(253,253,253,0.74)", marginTop: 10 }}>
        Comfort that grows with them.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
        <div style={{ width: 32, height: 1.5, background: growiee.pink, borderRadius: 1 }} />
        <div style={{ ...caps, color: growiee.pink }}>Newborn to 9 months · growiee.com</div>
      </div>
    </div>
  </AbsoluteFill>
);

// Supergraphic cover, v11: the v9 framing (flat Royal Indigo, giant
// tone-on-tone mark on the right) over a soft pattern of long flowing
// monoline threads, drawn like the mark itself (round caps, smooth curves).
// The threads fade out towards the copy so the lockup sits on calm colour.

const THREADS = 26;

const threadPath = (i: number) => {
  const base = -40 + i * 28;
  const pts: string[] = [];
  for (let x = -40; x <= W + 40; x += 8) {
    // Neighbouring threads share one slow flow, so they run side by side like
    // contour lines and only gently gather and spread.
    const flow = noise2D("growiee-flow", x * 0.0017, i * 0.03) * 120;
    const spread = noise2D("growiee-spread", x * 0.0007, i * 0.5) * 12;
    // A gentle diagonal lift so the threads flow up towards the mark.
    const lift = -x * 0.1;
    pts.push(`${pts.length === 0 ? "M" : "L"}${x.toFixed(1)} ${(base + flow + spread + lift + 120).toFixed(1)}`);
  }
  return pts.join(" ");
};

export const BannerSupergraphicV3: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.indigo, overflow: "hidden" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="threadFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0.15} />
          <stop offset="0.42" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="0.62" stopColor="#fff" stopOpacity={1} />
          <stop offset="1" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="threadMask">
          <rect width={W} height={H} fill="url(#threadFade)" />
        </mask>
      </defs>
      <g mask="url(#threadMask)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: THREADS }, (_, i) => {
          const accent = i === 9 || i === 17;
          return (
            <path
              key={i}
              d={threadPath(i)}
              stroke={accent ? growiee.violet : growiee.silk}
              strokeOpacity={accent ? 0.5 : 0.08 + (i % 3) * 0.014}
              strokeWidth={accent ? 1.4 : 1.1}
            />
          );
        })}
      </g>
      {/* The giant mark sits over the threads, one shade deeper than the field */}
      <g transform={`translate(${GIANT.left} ${GIANT.top}) scale(${scale}) translate(${-VB_X} ${-VB_Y})`}>
        <g fill="none" stroke={growiee.indigoDeep} strokeWidth={MARK_STROKE} strokeLinecap="round" strokeLinejoin="round">
          {MARK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <circle {...MARK_EYE} fill={growiee.indigoDeep} />
      </g>
    </svg>

    <div style={{ position: "absolute", left: 300, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Lockup color={growiee.silk} size={110} />
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 300,
          fontSize: 50,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: growiee.silk,
          marginTop: 40,
        }}
      >
        Gentle First Steps.
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: 21, color: "rgba(253,253,253,0.74)", marginTop: 10 }}>
        Comfort that grows with them.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 30 }}>
        <div style={{ width: 32, height: 1.5, background: growiee.pink, borderRadius: 1 }} />
        <div style={{ ...caps, color: growiee.pink }}>Newborn to 9 months · growiee.com</div>
      </div>
    </div>
  </AbsoluteFill>
);
