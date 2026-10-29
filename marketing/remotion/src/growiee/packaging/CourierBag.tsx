import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { fonts, growiee } from "../brand";
import { MARK_VIEWBOX } from "../logos/logoMark";
import { MarkShape } from "../social/FacebookBannerLogo";

// Courier mailer, v2: minimal and centred, the logo is the whole design.
// One spot colour on a stock poly bag, 12 x (16 + 2" flap) in. The face is
// drawn at 100 px per inch, so render with --scale=3 for exactly 300 dpi.
//
// Printed on the front only: the stacked lockup alone, centred on the part
// of the face the sealing flap leaves visible, with the domain small at the
// foot. The back stays plain for the courier's waybill.
//
// Two bags, same artwork:
//   milk:   Royal Indigo ink on milk white film (primary logo version).
//   purple: Off-White Silk (white) ink on violet film (the guide's reversed
//           version on violet).

loadNunito("normal", { weights: ["300"] });

const IN = 100;
const MM = IN / 25.4;
export const BAG_WIDTH = 12 * IN;
export const BAG_HEIGHT = 16 * IN;
const FLAP = 2 * IN;
const SAFE = 15 * MM;

// Film colours are non-printing: only here so previews look like the bag.
// Purple is sampled from the supplier's (WoMart) product photo.
export type Bag = "milk" | "purple";
const BAGS = {
  milk: { film: "#F7F5F0", flap: "#F2EFE8", ink: growiee.indigo, board: growiee.indigo },
  purple: { film: "#9459DA", flap: "#8A4FD1", ink: growiee.silk, board: growiee.slate },
} as const;

const [, , VB_W, VB_H] = MARK_VIEWBOX.split(" ").map(Number);

const caps: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 600,
  fontSize: 4.2 * MM,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: growiee.indigo,
  lineHeight: 1,
  // Tracking adds space after the last letter too; pull it back so centred
  // caps sit on the true centre line.
  marginRight: "-0.3em",
};

// Stacked lockup, as in the brand guide: wordmark at half the mark's height,
// 0.16 x mark height between them. `h` is the mark's height.
const Stacked: React.FC<{ h: number; ink: string }> = ({ h, ink }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <MarkShape color={ink} width={(h * VB_W) / VB_H} />
    <div
      style={{
        fontFamily: fonts.wordmark,
        fontSize: h * 0.5,
        lineHeight: 1,
        color: ink,
        // Pacifico's line box carries tall ascender room; this lands the
        // cap-height 0.16h below the feet, matching the guide.
        marginTop: h * 0.11,
      }}
    >
      Growiee
    </div>
  </div>
);

const centredRow = (top: number): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  right: 0,
  top,
  display: "flex",
  justifyContent: "center",
});

// ---------------------------------------------------------------- front

const MARK_H = 92 * MM;
// Optical centre of the visible face (below the flap), nudged up a touch.
const FRONT_CENTRE = FLAP + (BAG_HEIGHT - FLAP) * 0.47;

export const CourierBagFront: React.FC<{ bag?: Bag }> = ({ bag = "milk" }) => (
  <AbsoluteFill style={{ background: BAGS[bag].film }}>
    <div style={{ ...centredRow(FRONT_CENTRE * 2 - BAG_HEIGHT), bottom: 0, alignItems: "center" }}>
      <Stacked h={MARK_H} ink={BAGS[bag].ink} />
    </div>
    <div style={centredRow(BAG_HEIGHT - SAFE - 10 * MM)}>
      <div style={{ ...caps, color: BAGS[bag].ink }}>growiee.com</div>
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- board

// Presentation board: the front with the spec (on Royal Indigo for the milk
// bag, Midnight Slate for the purple one so two violets never touch), shown sealed
// with the 2 in flap folded down over the top of the face (the flap is not printed).
export const BOARD_WIDTH = 3000;
export const BOARD_HEIGHT = 2000;
const FACE_SCALE = 0.86;
const faceW = BAG_WIDTH * FACE_SCALE;
const faceH = BAG_HEIGHT * FACE_SCALE;

const boardCaps: React.CSSProperties = { ...caps, marginRight: 0, letterSpacing: "0.26em" };

const Face: React.FC<{ left: number; label: string; flap?: string; children: React.ReactNode }> = ({
  left,
  label,
  flap,
  children,
}) => (
  <div style={{ position: "absolute", left, top: 330 }}>
    <div
      style={{
        width: faceW,
        height: faceH,
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 60px 120px -40px rgba(10,12,48,0.55), 0 18px 40px -20px rgba(10,12,48,0.35)",
      }}
    >
      <div style={{ width: BAG_WIDTH, height: BAG_HEIGHT, transform: `scale(${FACE_SCALE})`, transformOrigin: "0 0" }}>{children}</div>
      {flap ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: FLAP * FACE_SCALE,
            background: flap,
            boxShadow: "0 6px 14px -8px rgba(34,47,62,0.28)",
            borderBottom: "1px solid rgba(34,47,62,0.06)",
          }}
        />
      ) : null}
      {/* Heat seals along the sides and bottom. */}
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 9px rgba(34,47,62,0.025)", pointerEvents: "none" }} />
    </div>
    <div style={{ ...boardCaps, color: growiee.silk, fontSize: 17, marginTop: 36, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 28, height: 2, borderRadius: 1, background: growiee.pink }} />
      {label}
    </div>
  </div>
);

const SpecRow: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div style={{ padding: "22px 0", borderBottom: "1px solid rgba(253,253,253,0.14)" }}>
    <div style={{ ...boardCaps, color: growiee.pink, fontSize: 14, letterSpacing: "0.24em" }}>{k}</div>
    <div style={{ fontFamily: fonts.sans, fontSize: 25, lineHeight: 1.45, color: growiee.silk, marginTop: 10 }}>{v}</div>
  </div>
);

const PRINT = {
  milk: { chip: growiee.indigo, text: "1 colour: Royal Indigo #2D348D · CMYK 68 63 0 45" },
  purple: { chip: growiee.silk, text: "1 colour: white, Off-White Silk #FDFDFD · opaque, double hit" },
} as const;

export const CourierBagBoard: React.FC<{ bag?: Bag }> = ({ bag = "milk" }) => (
  <AbsoluteFill style={{ background: BAGS[bag].board, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 180 + faceW + 240, top: 330 }}>
      <div style={{ ...boardCaps, color: growiee.pink, fontSize: 16 }}>Packaging · Courier mailer · v2</div>
      <div
        style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 64, color: growiee.silk, marginTop: 20, letterSpacing: "-0.015em" }}
      >
        Just the elephant.
      </div>
    </div>

    <Face left={180} label="Front · sealed" flap={BAGS[bag].flap}>
      <CourierBagFront bag={bag} />
    </Face>

    <div style={{ position: "absolute", left: 180 + faceW + 240, width: 1000, top: 760 }}>
      <SpecRow
        k="Bag"
        v={
          bag === "milk"
            ? "Milk white courier mailer, 12 × 16 in + 2 in flap (305 × 406 mm), 220G"
            : "Purple courier mailer (WoMart), 12 × 16 in + 2 in flap (305 × 406 mm)"
        }
      />
      <SpecRow
        k="Print"
        v={
          <>
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 20,
                borderRadius: 10,
                background: PRINT[bag].chip,
                marginRight: 12,
                verticalAlign: -3,
                boxShadow: "0 0 0 2px rgba(253,253,253,0.25)",
              }}
            />
            {PRINT[bag].text}
          </>
        }
      />
      <SpecRow k="Sides" v="Front only. The back stays plain for the courier waybill." />
      <SpecRow k="Artwork" v="Stacked logo, centred, mark 92 mm tall. growiee.com at the foot, baseline about 21 mm above the bottom edge." />
      <SpecRow k="Quantity" v="100 pcs (MOQ)" />
    </div>
  </AbsoluteFill>
);
