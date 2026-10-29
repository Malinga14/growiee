import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { fonts, growiee } from "../brand";
import { Mark } from "../logos/LogoColorways";

// A set of minimal Facebook covers (1640 x 624), each led by one brand colour.
// Same safe area as FacebookBanner: copy starts at x 300 (phones crop the
// sides to x 265-1375) and stays clear of the profile picture bottom-left.
// Stock photos in public/growiee/stock/ are Magnific (Freepik) downloads.

loadNunito("normal", { weights: ["300", "400"] });

const COPY_LEFT = 300;

const Lockup: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.16 }}>
    <Mark color={color} size={size} />
    <div style={{ fontFamily: fonts.wordmark, fontSize: size * 0.62, lineHeight: 1, color, marginTop: -size * 0.1 }}>
      Growiee
    </div>
  </div>
);

const Label: React.FC<{ color: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  color,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

const Headline: React.FC<{ color: string; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  color,
  children,
  size = 46,
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontWeight: 300,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: "-0.01em",
      color,
      whiteSpace: "pre-line",
      ...style,
    }}
  >
    {children}
  </div>
);

const Copy: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: COPY_LEFT,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

// 1 · Hold: Off-White Silk with a full-height photo panel; Petal Pink as a single hairline.
export const BannerHold: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.silk }}>
    <Img
      src={staticFile("growiee/stock/baby-feet-in-hands.jpg")}
      style={{ position: "absolute", left: 720, top: 0, width: 920, height: 624, objectFit: "cover", objectPosition: "50% 55%" }}
    />
    <Copy>
      <Lockup color={growiee.indigo} size={96} />
      <Headline color={growiee.indigo} style={{ marginTop: 40 }}>
        {"Soft from the very\nfirst hug."}
      </Headline>
      <div style={{ width: 56, height: 3, borderRadius: 2, background: growiee.pink, marginTop: 26 }} />
      <Label color={growiee.indigo} style={{ marginTop: 18 }}>
        Newborn to 9 months · growiee.com
      </Label>
    </Copy>
  </AbsoluteFill>
);

// 2 · Cotton: Royal Indigo field, square-cut cotton photo; Bright Sky carries the claim.
export const BannerCotton: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.indigo }}>
    <Img
      src={staticFile("growiee/stock/cotton-flower-branch.jpg")}
      style={{ position: "absolute", left: 1020, top: 0, width: 400, height: 624, objectFit: "cover", objectPosition: "50% 50%" }}
    />
    <Copy>
      <Lockup color={growiee.silk} size={84} />
      <Label color={growiee.sky} style={{ marginTop: 44 }}>
        100% Combed Cotton
      </Label>
      <Headline color={growiee.silk} style={{ marginTop: 14 }}>
        {"Pure cotton,\ngentle on new skin."}
      </Headline>
      <div style={{ fontFamily: fonts.sans, fontSize: 18, color: "rgba(253,253,253,0.78)", marginTop: 18 }}>
        AZO-free dyes · Nickel-free snaps · Flat seams
      </div>
    </Copy>
  </AbsoluteFill>
);

// 3 · Line: the clothesline photo melts into its own wall tone; Petal Pink badge.
const WALL = "#EEEDEA";
export const BannerLine: React.FC = () => (
  <AbsoluteFill style={{ background: WALL }}>
    <Img
      src={staticFile("growiee/stock/baby-clothes-line.jpg")}
      style={{
        position: "absolute",
        left: 620,
        top: -22,
        height: 646,
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 86%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 86%, transparent 100%)",
      }}
    />
    <Copy>
      <Lockup color={growiee.indigo} size={88} />
      <Headline color={growiee.indigo} style={{ marginTop: 38 }}>
        {"Little things,\nmade gently."}
      </Headline>
      <div style={{ display: "flex", marginTop: 26 }}>
        <div
          style={{
            background: growiee.pink,
            color: growiee.slate,
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
          Gift-ready · Islandwide delivery
        </div>
      </div>
    </Copy>
  </AbsoluteFill>
);

// 4 · Petal: pure brand, no photo. Royal Indigo lockup centred on Petal Pink.
export const BannerPetal: React.FC = () => (
  <AbsoluteFill style={{ background: growiee.pink, alignItems: "center", justifyContent: "center" }}>
    <Lockup color={growiee.indigo} size={150} />
    <div style={{ fontFamily: fonts.display, fontWeight: 400, fontSize: 26, color: growiee.indigo, marginTop: 28 }}>
      Gentle First Steps. Comfort That Grows With Them.
    </div>
    <Label color={growiee.indigo} style={{ marginTop: 22 }}>
      growiee.com
    </Label>
  </AbsoluteFill>
);

// 5 · Kit: Soft Violet offer block, the folded 3-kit on a silk disc.
export const BannerKit: React.FC = () => {
  const disc = { cx: 1120, cy: 312, d: 470 };
  return (
    <AbsoluteFill style={{ background: growiee.violet }}>
      <div
        style={{
          position: "absolute",
          left: disc.cx - disc.d / 2,
          top: disc.cy - disc.d / 2,
          width: disc.d,
          height: disc.d,
          borderRadius: "50%",
          background: growiee.silk,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: disc.cx - 170,
          top: disc.cy + 128,
          width: 340,
          height: 26,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,4,13,0.14), rgba(0,4,13,0))",
        }}
      />
      <Img
        src={staticFile("growiee/stack-folded-3kit.png")}
        style={{ position: "absolute", left: disc.cx - 160, top: disc.cy - 150, width: 320 }}
      />
      <Copy>
        <Lockup color={growiee.silk} size={84} />
        <Label color="rgba(253,253,253,0.8)" style={{ marginTop: 44 }}>
          3 pieces · Newborn to 9 months
        </Label>
        <Headline color={growiee.silk} style={{ marginTop: 14 }}>
          {"The Newborn 3-Kit."}
        </Headline>
        <div style={{ fontFamily: fonts.sans, fontSize: 20, color: "rgba(253,253,253,0.85)", marginTop: 12 }}>
          Ultra-soft, 100% combed cotton.
        </div>
      </Copy>
    </AbsoluteFill>
  );
};

export const bannerSet = [
  { id: "hold", component: BannerHold },
  { id: "cotton", component: BannerCotton },
  { id: "line", component: BannerLine },
  { id: "petal", component: BannerPetal },
  { id: "kit", component: BannerKit },
] as const;
