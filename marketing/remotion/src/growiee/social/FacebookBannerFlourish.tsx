import React from "react";
import { AbsoluteFill, random } from "remotion";
import { noise2D } from "@remotion/noise";
import { fonts, growiee } from "../brand";
import { MARK_EYE, MARK_PATHS, MARK_STROKE, MARK_VIEWBOX } from "../logos/logoMark";
import { Lockup } from "./FacebookBannerLogo";

// Supergraphic cover, v12. The giant tone-on-tone mark keeps its place on the
// right; behind it sits a generative pattern drawn in the mark's own language
// (one monoline weight, round caps, ear-like spirals, trunk-like loops) but
// never the mark itself. Seeded, so every render is identical.
//
// variant "curls":   a loose field of spiral-and-tail motifs.
// variant "threads": long single lines that loop into curls as they travel.
// variant "ribbons": silk bands of fine parallel lines that end in a trunk-like curl.

const W = 1640;
const H = 624;
const [VB_X, VB_Y, VB_W] = MARK_VIEWBOX.split(" ").map(Number);
const GIANT = { left: 860, top: -170, width: 1180 };
const scale = GIANT.width / VB_W;

type Pt = [number, number];
const toPath = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

// Ear-like spiral that unwinds into an S tail, in local units.
const curlMotif = (turns: number, tail: number, bend: number, r0 = 0.12): Pt[] => {
  const pts: Pt[] = [];
  const k = Math.log(1 / r0) / (turns * Math.PI * 2);
  const end = turns * Math.PI * 2;
  for (let t = 0; t <= end; t += 0.03) {
    const r = r0 * Math.exp(k * t);
    pts.push([r * Math.cos(t), r * Math.sin(t)]);
  }
  // Tangent at the outer end of the spiral.
  const [px, py] = pts[pts.length - 1];
  const [qx, qy] = pts[pts.length - 2];
  const len = Math.hypot(px - qx, py - qy);
  const d: Pt = [(px - qx) / len, (py - qy) / len];
  const n: Pt = [-d[1], d[0]];
  const c1: Pt = [px + d[0] * tail * 0.45, py + d[1] * tail * 0.45];
  const c2: Pt = [px + d[0] * tail * 0.6 - n[0] * bend, py + d[1] * tail * 0.6 - n[1] * bend];
  const e: Pt = [px + d[0] * tail + n[0] * bend * 0.4, py + d[1] * tail + n[1] * bend * 0.4];
  for (let s = 0.01; s <= 1.0001; s += 0.01) {
    const u = 1 - s;
    pts.push([
      u * u * u * px + 3 * u * u * s * c1[0] + 3 * u * s * s * c2[0] + s * s * s * e[0],
      u * u * u * py + 3 * u * u * s * c1[1] + 3 * u * s * s * c2[1] + s * s * s * e[1],
    ]);
  }
  return pts;
};

const placeMotif = (pts: Pt[], cx: number, cy: number, size: number, rot: number, mirror: boolean): Pt[] => {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  return pts.map(([x, y]) => {
    const mx = mirror ? -x : x;
    return [cx + (mx * c - y * s) * size, cy + (mx * s + y * c) * size];
  });
};

const curlField = (): Pt[][] => {
  const out: Pt[][] = [];
  const cellW = 205;
  const cellH = 178;
  for (let row = 0; row * cellH < H + cellH; row++) {
    for (let col = 0; col * cellW < W + cellW; col++) {
      const seed = `curl-${row}-${col}`;
      const jx = (random(seed + "x") - 0.5) * 90;
      const jy = (random(seed + "y") - 0.5) * 70;
      const off = row % 2 ? cellW / 2 : 0;
      const motif = curlMotif(1.15 + random(seed + "t") * 0.5, 1.4 + random(seed + "l") * 1.2, 0.6 + random(seed + "b") * 0.6);
      out.push(
        placeMotif(
          motif,
          col * cellW + off + jx - 40,
          row * cellH + jy - 20,
          34 + random(seed + "s") * 26,
          random(seed + "r") * Math.PI * 2,
          random(seed + "m") > 0.5,
        ),
      );
    }
  }
  return out;
};

// Prolate trochoid: a travelling line that throws a loop every cycle, with
// loop size and drift modulated by noise so no two loops match.
const thread = (i: number, y0: number, amp: number, period: number, lift: number): Pt[] => {
  const pts: Pt[] = [];
  const speed = period / (Math.PI * 2);
  for (let t = -Math.PI * 2; t < (W + 200) / speed; t += 0.035) {
    const loop = amp * (0.7 + 0.5 * noise2D(`loop-${i}`, t * 0.12, 0));
    const x = t * speed - loop * 0.9 * Math.sin(t) - 80;
    const drift = noise2D(`drift-${i}`, x * 0.0012, 0) * 70;
    const y = y0 + drift + loop * 0.55 * Math.cos(t) - x * lift;
    pts.push([x, y]);
  }
  return pts;
};

const threadField = (): Pt[][] => [
  thread(0, 40, 34, 230, 0.05),
  thread(1, 205, 46, 300, 0.07),
  thread(2, 380, 30, 210, 0.06),
  thread(3, 545, 42, 270, 0.08),
  thread(4, 700, 36, 250, 0.09),
];

// Silk ribbons: a smooth spline that ends in a curl whose bend tightens
// gradually (like the trunk), drawn as a band of fine parallel lines.

type Spine = { pts: Pt[]; radius: number[] };

const catmull = (cps: Pt[], step = 0.02): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < cps.length - 1; i++) {
    const p0 = cps[Math.max(0, i - 1)];
    const p1 = cps[i];
    const p2 = cps[i + 1];
    const p3 = cps[Math.min(cps.length - 1, i + 2)];
    for (let t = 0; t < 1; t += step) {
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(cps[cps.length - 1]);
  return out;
};

// Grow a curl from point p heading `heading`, turning `dir` (+1 / -1), with the
// bend radius easing from r0 down to r1 over `turn` radians.
const curl = (p: Pt, heading: number, dir: number, r0: number, r1: number, turn: number): Spine => {
  const pts: Pt[] = [];
  const radius: number[] = [];
  let [x, y] = p;
  let h = heading;
  let turned = 0;
  const ds = 1.5;
  while (turned < turn) {
    const r = r0 * Math.pow(r1 / r0, turned / turn);
    h += (dir * ds) / r;
    turned += ds / r;
    x += Math.cos(h) * ds;
    y += Math.sin(h) * ds;
    pts.push([x, y]);
    radius.push(r);
  }
  return { pts, radius };
};

// Spline through `cps`, finished at its first point with a curl.
const silkSpine = (cps: Pt[], dir: number, r0: number, r1: number, turn: number): Spine => {
  const body = catmull(cps);
  const [a, b] = [body[0], body[3]];
  const back = Math.atan2(a[1] - b[1], a[0] - b[0]);
  const c = curl(a, back, dir, r0, r1, turn);
  return {
    pts: [...c.pts.slice().reverse(), ...body],
    radius: [...c.radius.slice().reverse(), ...body.map(() => Infinity)],
  };
};

const ribbon = ({ pts, radius }: Spine, lines: number, gap: number): Pt[][] => {
  const half = ((lines - 1) / 2) * gap;
  const normals: Pt[] = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 2)];
    const b = pts[Math.min(pts.length - 1, i + 2)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
  });
  const out: Pt[][] = [];
  for (let k = 0; k < lines; k++) {
    const o = (k - (lines - 1) / 2) * gap;
    out.push(
      pts.map(([x, y], i) => {
        // Inside the curl the band narrows so its lines never cross.
        const squeeze = Math.min(1, (radius[i] - 4) / (half + 2));
        return [x + normals[i][0] * o * squeeze, y + normals[i][1] * o * squeeze];
      }),
    );
  }
  return out;
};

const ribbonField = (): Pt[][] => [
  // A: curls above the copy, floats over it, then sweeps down under the mark.
  ...ribbon(
    silkSpine(
      [
        [205, 66],
        [520, 56],
        [790, 128],
        [1040, 300],
        [1290, 470],
        [1520, 545],
        [1720, 560],
      ],
      -1,
      78,
      26,
      Math.PI * 1.75,
    ),
    9,
    5.5,
  ),
  // B: curls in the gap below the copy, rises through the mark to the top right.
  ...ribbon(
    silkSpine(
      [
        [905, 566],
        [1010, 480],
        [1190, 330],
        [1440, 190],
        [1720, 120],
      ],
      1,
      60,
      22,
      Math.PI * 1.7,
    ),
    7,
    5.5,
  ),
];

export const BannerFlourish: React.FC<{ variant: "curls" | "threads" | "ribbons" }> = ({ variant }) => {
  const lines = variant === "curls" ? curlField() : variant === "threads" ? threadField() : ribbonField();
  const weight = variant === "curls" ? 7 : variant === "threads" ? 6 : 1.6;
  return (
    <AbsoluteFill style={{ background: growiee.indigo, overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {/* Pattern breathes out behind the copy so the lockup sits on calm colour */}
          <radialGradient id="calm" cx="300" cy="312" r="620" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity={0.12} />
            <stop offset="0.55" stopColor="#fff" stopOpacity={0.55} />
            <stop offset="1" stopColor="#fff" stopOpacity={1} />
          </radialGradient>
          <mask id="calmMask">
            <rect width={W} height={H} fill="url(#calm)" />
          </mask>
        </defs>
        <g mask="url(#calmMask)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={weight}>
          {lines.map((pts, i) => {
            // One Petal Pink thread runs through the middle of ribbon A.
            const pinkThread = variant === "ribbons" && i === 4;
            return (
              <path
                key={i}
                d={toPath(pts)}
                stroke={pinkThread ? growiee.pink : variant === "ribbons" ? "#4C54B8" : "#3A42A3"}
                strokeOpacity={pinkThread ? 0.7 : 1}
              />
            );
          })}
        </g>
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
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: growiee.pink,
            }}
          >
            Newborn to 9 months · growiee.com
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
