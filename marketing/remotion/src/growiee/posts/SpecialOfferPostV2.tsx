import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonts, growiee } from "../brand";

// Facebook feed post, 1080 x 1350 (4:5). Baby centre, folded 3-kit right with a
// callout, ribbon-banner special offer underneath. Two colourways.
export const OFFER_V2_WIDTH = 1080;
export const OFFER_V2_HEIGHT = 1350;

export type OfferTheme = "blush" | "indigo";

export type SpecialOfferPostV2Props = {
  price: string;
  theme: OfferTheme;
};

type Palette = {
  background: string;
  letters: string;
  glow: string;
  mark: string;
  word: string;
  wordShadow: string;
  ribbon: string;
  ribbonFold: string;
  ribbonText: string;
  price: string;
  accent: string;
  floor: string;
};

const PALETTES: Record<OfferTheme, Palette> = {
  blush: {
    background: growiee.pink,
    letters: "#DE81A1",
    glow: "rgba(253,253,253,0.55)",
    mark: growiee.indigo,
    word: growiee.indigo,
    wordShadow: growiee.silk,
    ribbon: growiee.indigo,
    ribbonFold: "#1E2366",
    ribbonText: growiee.silk,
    price: growiee.indigo,
    accent: growiee.indigo,
    floor: "rgba(45,52,141,0.24)",
  },
  indigo: {
    background: growiee.indigo,
    letters: growiee.indigoDeep,
    glow: "rgba(232,197,200,0.20)",
    mark: growiee.silk,
    word: growiee.silk,
    wordShadow: growiee.pink,
    ribbon: growiee.pink,
    ribbonFold: "#C6728F",
    ribbonText: growiee.indigo,
    price: growiee.silk,
    accent: growiee.pink,
    floor: "rgba(0,4,13,0.45)",
  },
};

// Baby and folded stack share one floor line.
const FLOOR_Y = 1000;

const Background: React.FC<{ p: Palette }> = ({ p }) => {
  const letter: React.CSSProperties = {
    position: "absolute",
    fontFamily: fonts.wordmark,
    color: p.letters,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  return (
    <AbsoluteFill style={{ backgroundColor: p.background, overflow: "hidden" }}>
      <div style={{ ...letter, fontSize: 1150, left: -260, top: -560 }}>Gro</div>
      <div style={{ ...letter, fontSize: 1150, left: -90, top: 470 }}>wiee</div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 250,
          width: 900,
          height: 820,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${p.glow}, rgba(0,0,0,0))`,
        }}
      />
    </AbsoluteFill>
  );
};

// Logo mark and wordmark: mark sized to the wordmark's letter height and
// centred on it, the pair centred as one unit.
const BrandLockup: React.FC<{ p: Palette }> = ({ p }) => (
  <div
    style={{
      position: "absolute",
      top: 58,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 18,
    }}
  >
    <Img
      src={staticFile(p.mark === growiee.silk ? "growiee/mark-silk.svg" : "growiee/mark-indigo.svg")}
      style={{ height: 78, marginTop: 4 }}
    />
    <div
      style={{
        fontFamily: fonts.wordmark,
        fontSize: 78,
        lineHeight: 1.25,
        color: p.word,
        textShadow: `3px 3px 0 ${p.wordShadow}, 6px 6px 0 ${p.wordShadow}`,
        // optical centring: Pacifico's tall ascenders sit high in the box
        transform: "translateY(-6px)",
      }}
    >
      Growiee
    </div>
  </div>
);

const FloorShadow: React.FC<{ cx: number; width: number; color: string }> = ({ cx, width, color }) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top: FLOOR_Y - 22,
      width,
      height: 44,
      borderRadius: "50%",
      background: `radial-gradient(closest-side, ${color}, rgba(0,0,0,0))`,
    }}
  />
);

const Baby: React.FC<{ p: Palette }> = ({ p }) => {
  const height = 700;
  const width = Math.round((767 / 1235) * height);
  return (
    <>
      <FloorShadow cx={540} width={width * 1.05} color={p.floor} />
      <Img
        src={staticFile("growiee/baby-sitting.png")}
        style={{ position: "absolute", left: 540 - width / 2, top: FLOOR_Y - height, width, height }}
      />
    </>
  );
};

const STACK = { left: 760, width: 290 };
const stackHeight = Math.round((823 / 880) * STACK.width);

const FoldedStack: React.FC<{ p: Palette }> = ({ p }) => (
  <>
    <FloorShadow cx={STACK.left + STACK.width / 2} width={STACK.width * 1.1} color={p.floor} />
    <Img
      src={staticFile("growiee/stack-folded-3kit.png")}
      style={{ position: "absolute", left: STACK.left, top: FLOOR_Y - stackHeight + 6, width: STACK.width, height: stackHeight }}
    />
  </>
);

// "3-PIECE PACK" note with a hand-drawn arrow curling down to the stack.
const PackCallout: React.FC<{ p: Palette }> = ({ p }) => {
  const top = FLOOR_Y - stackHeight - 168;
  return (
    <div style={{ position: "absolute", left: STACK.left + 10, top, width: 290, color: p.accent }}>
      <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, letterSpacing: "0.14em", lineHeight: 1.12 }}>
        3-PIECE
        <br />
        PACK
      </div>
      <svg width="120" height="90" viewBox="0 0 120 90" style={{ position: "absolute", left: 150, top: 26 }} fill="none">
        <path d="M8 10 C 60 0, 98 26, 84 74" stroke={p.accent} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M70 62 L 84 78 L 98 62" stroke={p.accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// Ribbon banner with notched ends and folded tails, like the gift ribbon.
const RibbonBanner: React.FC<{ p: Palette; label: string }> = ({ p, label }) => {
  const w = 420;
  const h = 62;
  const tail = 46;
  const notch = 16;
  const drop = 12;
  return (
    <div style={{ position: "relative", width: w + tail * 2, height: h + drop }}>
      <svg width={w + tail * 2} height={h + drop} style={{ position: "absolute", inset: 0 }}>
        {/* tails, tucked behind */}
        <polygon points={`0,${drop} ${tail + 8},${drop} ${tail + 8},${h + drop} 0,${h + drop} ${notch},${drop + h / 2}`} fill={p.ribbon} />
        <polygon
          points={`${w + tail * 2},${drop} ${w + tail - 8},${drop} ${w + tail - 8},${h + drop} ${w + tail * 2},${h + drop} ${w + tail * 2 - notch},${drop + h / 2}`}
          fill={p.ribbon}
        />
        {/* folds */}
        <polygon points={`${tail},${h} ${tail + 8},${h} ${tail + 8},${h + drop}`} fill={p.ribbonFold} />
        <polygon points={`${w + tail},${h} ${w + tail - 8},${h} ${w + tail - 8},${h + drop}`} fill={p.ribbonFold} />
        {/* front band */}
        <rect x={tail} y={0} width={w} height={h} fill={p.ribbon} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: tail,
          top: 0,
          width: w,
          height: h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: "0.22em",
          paddingLeft: "0.22em",
          color: p.ribbonText,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Offer: React.FC<{ p: Palette; price: string }> = ({ p, price }) => (
  <div
    style={{
      position: "absolute",
      top: 1048,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: fonts.sans,
    }}
  >
    <RibbonBanner p={p} label="SPECIAL OFFER" />
    <div style={{ display: "flex", alignItems: "baseline", marginTop: 14, color: p.price }}>
      <div style={{ fontWeight: 700, fontSize: 100, lineHeight: 1, letterSpacing: "-0.02em" }}>{price}</div>
      <div style={{ fontWeight: 600, fontSize: 56, marginLeft: 6 }}>/=</div>
    </div>
    <div style={{ fontWeight: 600, fontSize: 26, letterSpacing: "0.5em", paddingLeft: "0.5em", marginTop: 6, color: p.accent }}>
      ONLY
    </div>
  </div>
);

export const SpecialOfferPostV2: React.FC<SpecialOfferPostV2Props> = ({ price, theme }) => {
  const p = PALETTES[theme];
  return (
    <AbsoluteFill>
      <Background p={p} />
      <BrandLockup p={p} />
      <FoldedStack p={p} />
      <PackCallout p={p} />
      <Baby p={p} />
      <Offer p={p} price={price} />
    </AbsoluteFill>
  );
};
