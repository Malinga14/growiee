import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonts, growiee } from "../brand";

// Facebook feed post, 1080 x 1350 (4:5). Premium, minimal, spec-sheet feel on
// Royal Indigo: halo-ringed baby with leader-line callouts, glass offer bar.
export const PREMIUM_WIDTH = 1080;
export const PREMIUM_HEIGHT = 1350;

export type PremiumOfferPostProps = {
  price: string;
  // v1: grid backdrop, price left, collection tag, COD line (original).
  // v2: supergraphic letters backdrop, price right, no tag, islandwide only.
  version?: "v1" | "v2";
};

const M = 64; // outer margin
const silk = growiee.silk;
const blush = growiee.pink;
const hair = "rgba(253,253,253,0.22)";

const BABY = { cx: 505, floor: 1010, height: 600 };
const babyWidth = Math.round((767 / 1235) * BABY.height);
const STACK = { left: 784, width: 230 };
const stackHeight = Math.round((823 / 880) * STACK.width);

const label: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 500,
  fontSize: 18,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: silk,
  whiteSpace: "nowrap",
};

const GridBackdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(70% 55% at 45% 52%, #3B43A8 0%, ${growiee.indigo} 45%, #1B205E 100%)`,
    }}
  >
    {/* faint technical grid */}
    <svg width={PREMIUM_WIDTH} height={PREMIUM_HEIGHT} style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={PREMIUM_HEIGHT} stroke={silk} strokeWidth={1} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 90} x2={PREMIUM_WIDTH} y2={i * 90} stroke={silk} strokeWidth={1} />
      ))}
    </svg>
    {/* fine grain */}
    <svg width={PREMIUM_WIDTH} height={PREMIUM_HEIGHT} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

// Oversized tone-on-tone wordmark letters, as on the earlier indigo posts.
const LettersBackdrop: React.FC = () => {
  const letter: React.CSSProperties = {
    position: "absolute",
    fontFamily: fonts.wordmark,
    color: growiee.indigoDeep,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  return (
    <AbsoluteFill style={{ backgroundColor: growiee.indigo, overflow: "hidden" }}>
      <div style={{ ...letter, fontSize: 1150, left: -260, top: -560 }}>Gro</div>
      <div style={{ ...letter, fontSize: 1150, left: -90, top: 470 }}>wiee</div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ showTag: boolean }> = ({ showTag }) => (
  <>
    <div style={{ position: "absolute", left: M, top: 52, display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={staticFile("growiee/mark-silk.svg")} style={{ height: 54, marginTop: 2 }} />
      <div
        style={{
          fontFamily: fonts.wordmark,
          fontSize: 54,
          lineHeight: 1.25,
          color: silk,
          textShadow: `2px 2px 0 ${blush}, 4px 4px 0 ${blush}`,
          transform: "translateY(-4px)",
        }}
      >
        Growiee
      </div>
    </div>
    {showTag ? (
      <div style={{ position: "absolute", right: M, top: 76, ...label, fontSize: 16, color: blush, textAlign: "right" }}>
        Collection 01 · 0–9M
      </div>
    ) : null}
    <div style={{ position: "absolute", left: M, right: M, top: 150, height: 1, background: hair }} />
  </>
);

const Headline: React.FC = () => (
  <div style={{ position: "absolute", left: M, top: 186, color: silk, fontFamily: fonts.sans }}>
    <div style={{ fontWeight: 300, fontSize: 80, lineHeight: 1.02, letterSpacing: "-0.02em" }}>Comfort,</div>
    <div style={{ fontWeight: 300, fontSize: 80, lineHeight: 1.02, letterSpacing: "-0.02em", color: blush }}>
      engineered for growth.
    </div>
  </div>
);

// Thin concentric halo behind the baby.
const Halo: React.FC = () => {
  const cy = BABY.floor - BABY.height / 2 + 10;
  return (
    <svg width={PREMIUM_WIDTH} height={PREMIUM_HEIGHT} style={{ position: "absolute", inset: 0 }} fill="none">
      <defs>
        <radialGradient id="halofill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(232,197,200,0.22)" />
          <stop offset="100%" stopColor="rgba(232,197,200,0)" />
        </radialGradient>
      </defs>
      <circle cx={BABY.cx} cy={cy} r={300} fill="url(#halofill)" />
      <circle cx={BABY.cx} cy={cy} r={300} stroke="rgba(253,253,253,0.26)" strokeWidth={1.2} />
      <circle cx={BABY.cx} cy={cy} r={244} stroke="rgba(232,197,200,0.35)" strokeWidth={1} strokeDasharray="2 9" />
    </svg>
  );
};

const FloorShadow: React.FC<{ cx: number; width: number }> = ({ cx, width }) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top: BABY.floor - 20,
      width,
      height: 40,
      borderRadius: "50%",
      background: "radial-gradient(closest-side, rgba(0,4,13,0.5), rgba(0,4,13,0))",
    }}
  />
);

const Subjects: React.FC = () => (
  <>
    <FloorShadow cx={STACK.left + STACK.width / 2} width={STACK.width * 1.1} />
    <Img
      src={staticFile("growiee/stack-folded-3kit.png")}
      style={{ position: "absolute", left: STACK.left, top: BABY.floor - stackHeight + 5, width: STACK.width, height: stackHeight }}
    />
    <FloorShadow cx={BABY.cx} width={babyWidth * 1.05} />
    <Img
      src={staticFile("growiee/baby-sitting.png")}
      style={{ position: "absolute", left: BABY.cx - babyWidth / 2, top: BABY.floor - BABY.height, width: babyWidth, height: BABY.height }}
    />
  </>
);

// Spec-sheet callout: index number, label, hairline leader ending in a dot.
const Callout: React.FC<{
  index: string;
  lines: string[];
  x: number;
  y: number;
  to: [number, number];
  align?: "left" | "right";
}> = ({ index, lines, x, y, to, align = "left" }) => (
  <>
    <svg width={PREMIUM_WIDTH} height={PREMIUM_HEIGHT} style={{ position: "absolute", inset: 0 }} fill="none">
      <path d={`M ${x} ${y + 34 + (lines.length - 1) * 24} L ${to[0]} ${to[1]}`} stroke="rgba(253,253,253,0.55)" strokeWidth={1.2} />
      <circle cx={to[0]} cy={to[1]} r={5} fill={blush} />
      <circle cx={to[0]} cy={to[1]} r={11} stroke="rgba(232,197,200,0.6)" strokeWidth={1} />
    </svg>
    <div
      style={{
        position: "absolute",
        top: y,
        ...(align === "left" ? { left: x } : { right: PREMIUM_WIDTH - x }),
        textAlign: align,
      }}
    >
      <div style={{ ...label, fontSize: 15, color: blush }}>{index}</div>
      {lines.map((l) => (
        <div key={l} style={{ ...label, fontSize: 18, marginTop: 4, lineHeight: 1.2 }}>
          {l}
        </div>
      ))}
    </div>
  </>
);

const Callouts: React.FC = () => (
  <>
    <Callout index="01" lines={["100% Combed", "Cotton"]} x={M} y={548} to={[452, 668]} />
    <Callout index="02" lines={["Nickel-free", "Snaps"]} x={M} y={812} to={[432, 920]} />
    <Callout index="03" lines={["3-Piece", "Pack"]} x={STACK.left + 14} y={548} to={[STACK.left + 115, BABY.floor - stackHeight - 18]} />
  </>
);

const PriceBlock: React.FC<{ price: string; align: "left" | "right" }> = ({ price, align }) => (
  <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "flex-end" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: blush, boxShadow: `0 0 14px ${blush}` }} />
      <div style={{ ...label, fontSize: 20, fontWeight: 600, color: blush }}>Special Offer</div>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", marginTop: 12 }}>
      <div style={{ fontWeight: 600, fontSize: 92, lineHeight: 1, letterSpacing: "-0.03em" }}>{price}</div>
      <div style={{ fontWeight: 400, fontSize: 48, marginLeft: 6 }}>/=</div>
      <div style={{ ...label, fontSize: 20, fontWeight: 600, marginLeft: 18 }}>Only</div>
    </div>
  </div>
);

const DetailsBlock: React.FC<{ delivery: string }> = ({ delivery }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ ...label, fontSize: 22, fontWeight: 600, letterSpacing: "0.16em" }}>3-Piece Pack</div>
    <div style={{ fontWeight: 300, fontSize: 24, opacity: 0.88 }}>Newborn to 9 months</div>
    <div style={{ fontWeight: 300, fontSize: 24, opacity: 0.88 }}>{delivery}</div>
  </div>
);

// Frosted glass bar holding the offer and the pack details.
const OfferBar: React.FC<{ price: string; priceRight: boolean; delivery: string }> = ({ price, priceRight, delivery }) => {
  const divider = <div style={{ width: 1, alignSelf: "stretch", margin: "40px 40px", background: hair }} />;
  return (
    <div
      style={{
        position: "absolute",
        left: M,
        right: M,
        top: 1062,
        height: 224,
        borderRadius: 28,
        background: "linear-gradient(135deg, rgba(253,253,253,0.14), rgba(253,253,253,0.05))",
        border: "1px solid rgba(253,253,253,0.28)",
        boxShadow: "inset 0 1px 0 rgba(253,253,253,0.25), 0 30px 60px rgba(0,4,13,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: priceRight ? "space-between" : "flex-start",
        padding: "0 44px",
        color: silk,
        fontFamily: fonts.sans,
      }}
    >
      {priceRight ? (
        <>
          <DetailsBlock delivery={delivery} />
          {divider}
          <PriceBlock price={price} align="right" />
        </>
      ) : (
        <>
          <PriceBlock price={price} align="left" />
          {divider}
          <DetailsBlock delivery={delivery} />
        </>
      )}
    </div>
  );
};

export const PremiumOfferPost: React.FC<PremiumOfferPostProps> = ({ price, version = "v1" }) => (
  <AbsoluteFill>
    {version === "v2" ? <LettersBackdrop /> : <GridBackdrop />}
    <Header showTag={version === "v1"} />
    <Headline />
    <Halo />
    <Subjects />
    <Callouts />
    <OfferBar
      price={price}
      priceRight={version === "v2"}
      delivery={version === "v2" ? "Islandwide Delivery" : "Islandwide · Cash on Delivery"}
    />
  </AbsoluteFill>
);
