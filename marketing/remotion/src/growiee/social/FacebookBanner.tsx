import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { fonts, growiee } from "../brand";
import { Mark } from "../logos/LogoColorways";

// Facebook page cover, 1640 x 624 (shown at 820 x 312 on desktop).
// Phones crop the sides to the central ~1110 px, and the profile picture sits
// over the bottom-left corner, so all copy and product stay inside x 265-1375
// and clear of the bottom-left.
export const FB_BANNER_WIDTH = 1640;
export const FB_BANNER_HEIGHT = 624;

// Light display weight for the headline, on top of the weights brand.ts loads.
loadNunito("normal", { weights: ["300"] });

type Theme = {
  background: string;
  ink: string; // mark, wordmark, headline
  body: string;
  label: string;
  arch: string;
  archLine: string;
  chip: string;
  chipText: string;
  shadow: string;
};

export const bannerThemes: Record<"silk" | "indigo", Theme> = {
  // Royal Indigo on Off-White Silk, Petal Pink tint behind the baby.
  silk: {
    background: growiee.silk,
    ink: growiee.indigo,
    body: "#576574",
    label: growiee.indigo,
    arch: "#FCE6EE",
    archLine: "rgba(45,52,141,0.18)",
    chip: "#F5F5F5",
    chipText: growiee.slate,
    shadow: "rgba(0,4,13,0.16)",
  },
  // Off-White Silk on Royal Indigo, silk arch behind the baby.
  indigo: {
    background: growiee.indigo,
    ink: growiee.silk,
    body: "rgba(253,253,253,0.78)",
    label: growiee.pink,
    arch: growiee.silk,
    archLine: "rgba(253,253,253,0.22)",
    chip: "rgba(253,253,253,0.10)",
    chipText: growiee.silk,
    shadow: "rgba(0,4,13,0.38)",
  },
};

const Chip: React.FC<{ bg: string; color: string; children: React.ReactNode }> = ({ bg, color, children }) => (
  <div
    style={{
      background: bg,
      color,
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      padding: "12px 20px",
      borderRadius: 9999,
      lineHeight: 1,
    }}
  >
    {children}
  </div>
);

export const FacebookBanner: React.FC<{ theme: keyof typeof bannerThemes }> = ({ theme }) => {
  const t = bannerThemes[theme];

  // Arch frame for the product, bleeding off the bottom edge.
  const arch = { left: 986, top: 64, width: 352 };
  const lineGap = 18;
  const floor = 604;

  const markSize = 150;

  return (
    <AbsoluteFill style={{ background: t.background, overflow: "hidden" }}>
      {/* Hairline echo of the arch */}
      <div
        style={{
          position: "absolute",
          left: arch.left - lineGap,
          top: arch.top - lineGap,
          width: arch.width + lineGap * 2,
          height: FB_BANNER_HEIGHT,
          borderRadius: `${(arch.width + lineGap * 2) / 2}px ${(arch.width + lineGap * 2) / 2}px 0 0`,
          border: `1.5px solid ${t.archLine}`,
          borderBottom: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: arch.left,
          top: arch.top,
          width: arch.width,
          height: FB_BANNER_HEIGHT,
          background: t.arch,
          borderRadius: `${arch.width / 2}px ${arch.width / 2}px 0 0`,
        }}
      />

      {/* Soft contact shadow so baby and stack sit on one floor */}
      <div
        style={{
          position: "absolute",
          left: 880,
          top: floor - 14,
          width: 460,
          height: 30,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${t.shadow}, rgba(0,4,13,0))`,
        }}
      />

      <Img
        src={staticFile("growiee/baby-sitting.png")}
        style={{ position: "absolute", left: 1056, top: floor - 414, height: 414 }}
      />
      <Img
        src={staticFile("growiee/stack-folded-3kit.png")}
        style={{ position: "absolute", left: 872, top: floor - 186, width: 199 }}
      />

      {/* Copy block */}
      <div
        style={{
          position: "absolute",
          left: 372,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: t.label,
          }}
        >
          Newborn to 9 months · growiee.com
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: markSize * 0.18, marginTop: 14 }}>
          <Mark color={t.ink} size={markSize} />
          <div
            style={{
              fontFamily: fonts.wordmark,
              fontSize: 92,
              lineHeight: 1,
              color: t.ink,
              marginTop: -markSize * 0.1,
            }}
          >
            Growiee
          </div>
        </div>

        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 300,
            fontSize: 50,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: t.ink,
            marginTop: 22,
          }}
        >
          Gentle First Steps.
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: 22, lineHeight: 1.5, color: t.body, marginTop: 8 }}>
          Comfort that grows with them.
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <Chip bg={growiee.sky} color={growiee.slate}>
            100% Combed Cotton
          </Chip>
          <Chip bg={t.chip} color={t.chipText}>
            AZO-Free Dyes
          </Chip>
        </div>
      </div>
    </AbsoluteFill>
  );
};
