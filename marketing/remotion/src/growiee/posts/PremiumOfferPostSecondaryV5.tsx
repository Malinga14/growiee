import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonts, growiee } from "../brand";

// v5 of the secondary-colour premium post: v4 without the dot before
// "Special Offer".
export const PREMIUM_SEC5_WIDTH = 1080;
export const PREMIUM_SEC5_HEIGHT = 1350;
const PREMIUM_WIDTH = PREMIUM_SEC5_WIDTH;
const PREMIUM_HEIGHT = PREMIUM_SEC5_HEIGHT;

export type PremiumOfferPostSecondaryV5Props = {
  price: string;
};

// Light Bright Sky tint: keeps Royal Indigo type at 6.6:1.
const OCEAN_TINT = "#9FE4FD";

const M = 64; // outer margin
const silk = growiee.indigo; // primary text colour on the light background
const blush = growiee.indigo; // accent role, also Royal Indigo here
const hair = "rgba(45,52,141,0.22)";

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

// Oversized tone-on-tone wordmark letters, as on the earlier indigo posts.
const LettersBackdrop: React.FC = () => {
  const letter: React.CSSProperties = {
    position: "absolute",
    fontFamily: fonts.wordmark,
    // soft white fill that fades out, so the letters read as pattern, not noise
    backgroundImage: "linear-gradient(180deg, rgba(253,253,253,0.42) 0%, rgba(253,253,253,0.12) 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, ${growiee.pink} 0%, ${growiee.pink} 28%, ${OCEAN_TINT} 100%)`,
        overflow: "hidden",
      }}
    >
      <div style={{ ...letter, fontSize: 1150, left: -260, top: -560 }}>Gro</div>
      <div style={{ ...letter, fontSize: 1150, left: -90, top: 470 }}>wiee</div>
      {/* soft light behind the baby */}
      <div
        style={{
          position: "absolute",
          left: BABY.cx - 430,
          top: BABY.floor - BABY.height - 120,
          width: 860,
          height: 820,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(253,253,253,0.6), rgba(253,253,253,0))",
        }}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: M, top: 52, display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={staticFile("growiee/mark-indigo.svg")} style={{ height: 54, marginTop: 2 }} />
      <div
        style={{
          fontFamily: fonts.wordmark,
          fontSize: 54,
          lineHeight: 1.25,
          color: silk,
          textShadow: `2px 2px 0 ${growiee.silk}, 4px 4px 0 ${growiee.silk}`,
          transform: "translateY(-4px)",
        }}
      >
        Growiee
      </div>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 150, height: 1, background: hair }} />
  </>
);

const Headline: React.FC = () => (
  <div style={{ position: "absolute", left: M, top: 190, color: growiee.indigo }}>
    <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: 84, lineHeight: 1.04, letterSpacing: "-0.015em" }}>
      Gentle first steps.
    </div>
    <div
      style={{
        fontFamily: fonts.displayItalic,
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: 52,
        lineHeight: 1.15,
        marginTop: 8,
        color: "#086789",
      }}
    >
      Comfort that grows with them.
    </div>
  </div>
);

const FloorShadow: React.FC<{ cx: number; width: number }> = ({ cx, width }) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top: BABY.floor - 20,
      width,
      height: 40,
      borderRadius: "50%",
      background: "radial-gradient(closest-side, rgba(45,52,141,0.28), rgba(45,52,141,0))",
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

// Feature tag: frosted pill label, fine leader line, soft dot on the garment.
const Tag: React.FC<{ text: string; x: number; y: number; to: [number, number]; anchor?: "left" | "right" }> = ({
  text,
  x,
  y,
  to,
  anchor = "left",
}) => {
  const h = 46;
  const fromX = anchor === "left" ? x : x;
  return (
    <>
      <svg width={PREMIUM_WIDTH} height={PREMIUM_HEIGHT} style={{ position: "absolute", inset: 0 }} fill="none">
        <path d={`M ${fromX} ${y + h / 2} L ${to[0]} ${to[1]}`} stroke="rgba(45,52,141,0.45)" strokeWidth={1.2} />
        <circle cx={to[0]} cy={to[1]} r={14} fill="rgba(253,253,253,0.55)" />
        <circle cx={to[0]} cy={to[1]} r={5} fill={growiee.indigo} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: y,
          ...(anchor === "left" ? { right: PREMIUM_WIDTH - x } : { left: x }),
          height: h,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px 0 14px",
          borderRadius: 999,
          background: "rgba(253,253,253,0.7)",
          border: "1px solid rgba(253,253,253,0.95)",
          boxShadow: "0 10px 24px rgba(45,52,141,0.12)",
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: growiee.sky }} />
        <div style={{ ...label, fontSize: 16, fontWeight: 600, letterSpacing: "0.12em" }}>{text}</div>
      </div>
    </>
  );
};

const Callouts: React.FC = () => (
  <>
    <Tag text="3-Piece Pack" x={STACK.left + 20} y={600} to={[STACK.left + 115, BABY.floor - stackHeight - 16]} anchor="right" />
  </>
);

const PriceBlock: React.FC<{ price: string; align: "left" | "right" }> = ({ price, align }) => (
  <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "flex-end" }}>
    <div style={{ ...label, fontSize: 20, fontWeight: 600, color: blush }}>Special Offer</div>
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
        background: "linear-gradient(135deg, rgba(253,253,253,0.62), rgba(253,253,253,0.38))",
        border: "1px solid rgba(253,253,253,0.8)",
        boxShadow: "inset 0 1px 0 rgba(253,253,253,0.9), 0 30px 60px rgba(45,52,141,0.18)",
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

export const PremiumOfferPostSecondaryV5: React.FC<PremiumOfferPostSecondaryV5Props> = ({ price }) => (
  <AbsoluteFill>
    <LettersBackdrop />
    <Header />
    <Headline />
    <Subjects />
    <Callouts />
    <OfferBar price={price} priceRight delivery="Islandwide Delivery" />
  </AbsoluteFill>
);
