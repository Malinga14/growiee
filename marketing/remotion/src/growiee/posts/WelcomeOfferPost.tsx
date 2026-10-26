import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonts, growiee } from "../brand";

// Facebook feed post, 1080 x 1350 (4:5).
export const POST_WIDTH = 1080;
export const POST_HEIGHT = 1350;

export type WelcomeOfferPostProps = {
  price: string;
};

// Oversized, cropped wordmark letters in a deeper indigo: a tone-on-tone
// supergraphic behind everything.
const Supergraphic: React.FC = () => {
  const letter: React.CSSProperties = {
    position: "absolute",
    fontFamily: fonts.wordmark,
    color: growiee.indigoDeep,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ ...letter, fontSize: 1150, left: -260, top: -560 }}>Gro</div>
      <div style={{ ...letter, fontSize: 1150, left: -90, top: 470 }}>wiee</div>
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => (
  <div style={{ position: "absolute", left: 72, top: 92, color: growiee.silk }}>
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 500,
        fontSize: 22,
        letterSpacing: "0.42em",
        color: growiee.pink,
      }}
    >
      WELCOME TO
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}>
      <Img src={staticFile("growiee/mark-silk.svg")} style={{ height: 76 }} />
      <div
        style={{
          fontFamily: fonts.wordmark,
          fontSize: 80,
          lineHeight: 1,
          paddingBottom: 16,
          textShadow: `3px 3px 0 ${growiee.pink}, 6px 6px 0 ${growiee.pink}`,
        }}
      >
        Growiee
      </div>
    </div>
    <div
      style={{
        fontFamily: fonts.displayItalic,
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: 29,
        lineHeight: 1.3,
        marginTop: 14,
        opacity: 0.92,
      }}
    >
      Gentle first steps.
      <br />
      Comfort that grows with them.
    </div>
  </div>
);

const Portrait: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 712,
      top: 58,
      width: 320,
      height: 320,
      borderRadius: "50%",
      overflow: "hidden",
      boxShadow: `0 0 0 8px ${growiee.silk}, 0 0 0 11px ${growiee.pink}, 0 24px 50px rgba(0,4,13,0.35)`,
    }}
  >
    <Img
      src={staticFile("growiee/baby-portrait.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
);

// The 3-kit flat-lay as a floating photo card.
const TrioCard: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 60,
      top: 420,
      width: 960,
      height: 536,
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "0 30px 70px rgba(0,4,13,0.38)",
    }}
  >
    <Img
      src={staticFile("growiee/trio-3kit.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
);

const Outro: React.FC = () => (
  <div style={{ position: "absolute", left: 72, top: 1028, color: growiee.silk }}>
    <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: 64, lineHeight: 1.05 }}>
      One pack.
    </div>
    <div
      style={{
        fontFamily: fonts.displayItalic,
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: 50,
        lineHeight: 1.1,
        marginTop: 6,
      }}
    >
      Three little favourites.
    </div>
    <div
      style={{
        fontFamily: fonts.sans,
        fontWeight: 500,
        fontSize: 22,
        letterSpacing: "0.24em",
        marginTop: 26,
        color: growiee.pink,
      }}
    >
      3-PIECE PACKS · 0–9 MONTHS
    </div>
  </div>
);

// Offer seal: level, clean sans type, price with "ONLY" underneath.
const OfferSeal: React.FC<{ price: string }> = ({ price }) => {
  const size = 364;
  return (
    <div
      style={{
        position: "absolute",
        left: 1020 - size,
        top: 972,
        width: size,
        height: size,
        borderRadius: "50%",
        background: growiee.silk,
        boxShadow: "0 24px 50px rgba(0,4,13,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* inner hairline ring */}
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: "50%",
          border: `2px solid ${growiee.pink}`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: fonts.sans,
          color: growiee.indigo,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 29, letterSpacing: "0.08em", marginRight: "-0.08em" }}>
          SPECIAL OFFER
        </div>
        <div style={{ width: 64, height: 3, borderRadius: 2, background: growiee.pink, margin: "16px 0 14px" }} />
        <div style={{ fontWeight: 700, fontSize: 70, lineHeight: 1, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
          {price}
          <span style={{ fontWeight: 600, fontSize: 44, marginLeft: 4 }}>/=</span>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "7px 22px 6px",
            borderRadius: 999,
            background: growiee.indigo,
            color: growiee.silk,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "0.3em",
            paddingRight: "calc(22px - 0.3em)",
          }}
        >
          ONLY
        </div>
      </div>
    </div>
  );
};

export const WelcomeOfferPost: React.FC<WelcomeOfferPostProps> = ({ price }) => (
  <AbsoluteFill style={{ backgroundColor: growiee.indigo }}>
    <Supergraphic />
    <Intro />
    <Portrait />
    <TrioCard />
    <Outro />
    <OfferSeal price={price} />
  </AbsoluteFill>
);
