import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonts, growiee } from "../brand";

// Facebook feed post, 1080 x 1350 (4:5): baby centre, folded 3-kit right,
// open-type special offer underneath. Secondary colours carry the background.
export const OFFER_POST_WIDTH = 1080;
export const OFFER_POST_HEIGHT = 1350;

export type SpecialOfferPostProps = {
  price: string;
  // Supergraphic letters: tone-on-tone deeper blush, or Bright Sky tint.
  letters: "blush" | "ocean";
};

const LETTER_STYLE = {
  blush: { color: "#DE81A1", opacity: 1 },
  ocean: { color: growiee.sky, opacity: 0.34 },
} as const;

// Floor line shared by the baby and the folded stack.
const FLOOR_Y = 918;

const Background: React.FC<{ letters: SpecialOfferPostProps["letters"] }> = ({ letters }) => {
  const letter: React.CSSProperties = {
    position: "absolute",
    fontFamily: fonts.wordmark,
    ...LETTER_STYLE[letters],
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  return (
    <AbsoluteFill style={{ backgroundColor: growiee.pink, overflow: "hidden" }}>
      <div style={{ ...letter, fontSize: 1150, left: -260, top: -560 }}>Gro</div>
      <div style={{ ...letter, fontSize: 1150, left: -90, top: 470 }}>wiee</div>
      {/* soft light behind the subjects */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 180,
          width: 900,
          height: 820,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(253,253,253,0.55), rgba(253,253,253,0))`,
        }}
      />
    </AbsoluteFill>
  );
};

const BrandLockup: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 64,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      color: growiee.indigo,
    }}
  >
    <Img src={staticFile("growiee/mark-indigo.svg")} style={{ height: 84 }} />
    <div
      style={{
        fontFamily: fonts.wordmark,
        fontSize: 86,
        lineHeight: 1,
        paddingBottom: 18,
        textShadow: `3px 3px 0 ${growiee.silk}, 6px 6px 0 ${growiee.silk}`,
      }}
    >
      Growiee
    </div>
  </div>
);

const FloorShadow: React.FC<{ cx: number; width: number }> = ({ cx, width }) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top: FLOOR_Y - 22,
      width,
      height: 44,
      borderRadius: "50%",
      background: "radial-gradient(closest-side, rgba(45,52,141,0.22), rgba(45,52,141,0))",
    }}
  />
);

const Baby: React.FC = () => {
  const height = 720;
  const width = Math.round((767 / 1235) * height);
  return (
    <>
      <FloorShadow cx={540} width={width * 1.05} />
      <Img
        src={staticFile("growiee/baby-sitting.png")}
        style={{ position: "absolute", left: 540 - width / 2, top: FLOOR_Y - height, width, height }}
      />
    </>
  );
};

const FoldedStack: React.FC = () => {
  const width = 300;
  const height = Math.round((823 / 880) * width);
  const left = 752;
  return (
    <>
      <FloorShadow cx={left + width / 2} width={width * 1.1} />
      <Img
        src={staticFile("growiee/stack-folded-3kit.png")}
        style={{ position: "absolute", left, top: FLOOR_Y - height + 6, width, height }}
      />
    </>
  );
};

// Open typography: no circle, no box, transparent on the background.
const Offer: React.FC<{ price: string }> = ({ price }) => (
  <div
    style={{
      position: "absolute",
      top: 968,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: fonts.sans,
      color: growiee.indigo,
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 42, letterSpacing: "0.22em", marginRight: "-0.22em" }}>
      SPECIAL OFFER
    </div>
    <div style={{ fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 10 }}>
      {price}
      <span style={{ fontWeight: 600, fontSize: 84, marginLeft: 8 }}>/=</span>
    </div>
    <div style={{ fontWeight: 600, fontSize: 34, letterSpacing: "0.5em", marginRight: "-0.5em", marginTop: 10 }}>
      ONLY
    </div>
  </div>
);

export const SpecialOfferPost: React.FC<SpecialOfferPostProps> = ({ price, letters }) => (
  <AbsoluteFill>
    <Background letters={letters} />
    <BrandLockup />
    <FoldedStack />
    <Baby />
    <Offer price={price} />
  </AbsoluteFill>
);
