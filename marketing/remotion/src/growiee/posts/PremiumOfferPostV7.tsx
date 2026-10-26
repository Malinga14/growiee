import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonts, growiee } from "../brand";

// v7: v6 layout on Royal Indigo with the original tone-on-tone letter pattern,
// light type, dark glass offer bar, no pack tag.
export const PREMIUM_V7_WIDTH = 1080;
export const PREMIUM_V7_HEIGHT = 1350;
const PREMIUM_WIDTH = PREMIUM_V7_WIDTH;
const PREMIUM_HEIGHT = PREMIUM_V7_HEIGHT;

export type PremiumOfferPostV7Props = {
  price: string;
};



const M = 64; // outer margin
const silk = growiee.silk; // primary text on Royal Indigo
const blush = growiee.pink; // accent labels
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
    <AbsoluteFill
      style={{
        background: growiee.indigo,
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
          background: "radial-gradient(closest-side, rgba(232,197,200,0.22), rgba(232,197,200,0))",
        }}
      />
    </AbsoluteFill>
  );
};

const Header: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: M, top: 52, display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={staticFile("growiee/mark-silk.svg")} style={{ height: 54, marginTop: 2 }} />
      <div
        style={{
          fontFamily: fonts.wordmark,
          fontSize: 54,
          lineHeight: 1.25,
          color: silk,
          textShadow: `2px 2px 0 ${growiee.pink}, 4px 4px 0 ${growiee.pink}`,
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
  <div
    style={{
      position: "absolute",
      left: M,
      top: 196,
      color: growiee.silk,
      fontFamily: fonts.displayItalic,
      fontStyle: "italic",
      fontWeight: 300,
      fontSize: 64,
      lineHeight: 1.18,
      letterSpacing: "-0.005em",
    }}
  >
    Gentle first steps.
    <br />
    Comfort that grows with them.
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

export const PremiumOfferPostV7: React.FC<PremiumOfferPostV7Props> = ({ price }) => (
  <AbsoluteFill>
    <LettersBackdrop />
    <Header />
    <Headline />
    <Subjects />
    <OfferBar price={price} priceRight delivery="Islandwide Delivery" />
  </AbsoluteFill>
);
