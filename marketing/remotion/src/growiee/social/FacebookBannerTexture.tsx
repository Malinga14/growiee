import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonts, growiee } from "../brand";
import { Lockup } from "./FacebookBannerLogo";

// Facebook covers (1640 x 624) on full-bleed fabric backgrounds, each graded
// toward one brand colour. Backgrounds are Magnific (Freepik) stock downloads
// in public/growiee/stock/bg-*.jpg. Same safe area as the other covers.

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

const Background: React.FC<{ src: string; position: string; style?: React.CSSProperties }> = ({
  src,
  position,
  style,
}) => (
  <Img
    src={staticFile(`growiee/stock/${src}`)}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position, ...style }}
  />
);

const LeftCopy: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 300, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
    {children}
  </div>
);

// 1 · Drift: white fabric sweeping along the bottom, lifted to Off-White Silk.
export const BannerDrift: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.silk }}>
    <Background src="bg-white-fabric.jpg" position="50% 78%" style={{ filter: "brightness(1.05) saturate(0.6)" }} />
    <LeftCopy>
      <Lockup color={growiee.indigo} size={104} />
      <div style={{ ...headline, color: growiee.indigo, marginTop: 36 }}>{"Wrapped in softness,\nfrom day one."}</div>
      <div style={{ display: "flex", marginTop: 28 }}>
        <div
          style={{
            ...caps,
            letterSpacing: "0.16em",
            background: growiee.sky,
            color: growiee.slate,
            padding: "12px 20px",
            borderRadius: 9999,
            lineHeight: 1,
          }}
        >
          100% Combed Cotton
        </div>
      </div>
    </LeftCopy>
  </AbsoluteFill>
);

// 2 · Chiffon: pink chiffon warmed toward Petal Pink, the lockup centred.
export const BannerChiffon: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.pink }}>
    <Background src="bg-pink-chiffon.jpg" position="60% 55%" style={{ transform: "scale(1.12)" }} />
    {/* Grade the dusty pink toward Petal Pink without flattening the folds */}
    <AbsoluteFill style={{ background: growiee.pink, mixBlendMode: "color", opacity: 0.55 }} />
    <AbsoluteFill style={{ background: "rgba(253,253,253,0.18)" }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Lockup color={growiee.indigo} size={150} />
      <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: 28, color: growiee.indigo, marginTop: 26 }}>
        Soft from the very first hug.
      </div>
      <div style={{ ...caps, color: growiee.indigo, marginTop: 20 }}>growiee.com</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// 3 · Midnight: dark silk drapes graded into Royal Indigo, silk type, Petal Pink label.
export const BannerMidnight: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.indigoDeep }}>
    <Background src="bg-navy-silk.jpg" position="50% 50%" />
    <AbsoluteFill style={{ background: growiee.indigo, mixBlendMode: "color", opacity: 0.7 }} />
    <AbsoluteFill style={{ background: growiee.indigoDeep, opacity: 0.38 }} />
    {/* Quiet the folds behind the copy so the type reads cleanly */}
    <AbsoluteFill
      style={{ background: "linear-gradient(90deg, rgba(32,38,110,0.82) 0%, rgba(32,38,110,0.55) 45%, rgba(32,38,110,0) 75%)" }}
    />
    <LeftCopy>
      <Lockup color={growiee.silk} size={110} />
      <div style={{ ...headline, color: growiee.silk, marginTop: 38 }}>A gentle first gift.</div>
      <div style={{ fontFamily: fonts.sans, fontSize: 21, color: "rgba(253,253,253,0.8)", marginTop: 10 }}>
        Thoughtfully made for newborn to 9 months.
      </div>
      <div style={{ ...caps, color: growiee.pink, marginTop: 30 }}>Gift-ready · Islandwide delivery</div>
    </LeftCopy>
  </AbsoluteFill>
);

export const textureBannerSet = [
  { id: "drift", component: BannerDrift },
  { id: "chiffon", component: BannerChiffon },
  { id: "midnight", component: BannerMidnight },
] as const;
