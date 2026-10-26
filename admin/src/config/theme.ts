import colorTokens from "../../../branding/tokens/color.tokens.json";

/**
 * Colour tokens — the Growiee brand palette, read straight from
 * branding/tokens/color.tokens.json so the dashboard always matches the brand.
 *
 *   primary (Royal Indigo) · violet (Soft Violet) · sky (Bright Sky) ·
 *   pink (Petal Pink) · ink (Midnight Slate) on Off-White Silk.
 *
 * Gain/loss come from the brand where they can: profit reads in Bright Sky's
 * deep tone, loss in a rose that stays distinguishable from it under
 * red-green colour blindness. Use `-strong` for text.
 *
 * The single source for both Tailwind classes and the hex values Recharts
 * needs (SVG props can't read Tailwind classes).
 */
const brand = colorTokens.color.brand;
const base = colorTokens.color.base;

export const colors = {
  canvas: base.background.$value, // Off-White Silk
  surface: "#FFFFFF",
  /** App chrome (sidebar, header logo zone): silk with a breath of indigo. */
  chrome: "#F7F7FD",

  ink: base.foreground.$value, // Midnight Slate — strongest text
  heading: brand["royal-indigo"].$value, // headings in Royal Indigo
  "ink-muted": "#576574", // captions / secondary (5.9:1 on silk)
  "ink-faint": "#8395A7", // axis ticks, tertiary

  primary: brand["royal-indigo"].$value, // Royal Indigo
  "primary-strong": "#232A73",
  "primary-soft": "#EEEFFA",

  violet: brand["soft-violet"].$value, // Soft Violet
  "violet-strong": "#5C4EC4",
  "violet-soft": "#F0EEFD",

  sky: brand["bright-sky"].$value, // Bright Sky
  "sky-strong": "#086789",
  "sky-soft": "#E7F8FE",

  pink: brand["petal-pink"].$value, // Petal Pink
  "pink-strong": "#B4456E",
  "pink-soft": "#FEEFF4",

  gain: brand["bright-sky"].$value,
  "gain-strong": "#086789",
  "gain-soft": "#E7F8FE",

  loss: "#F43F5E",
  "loss-strong": "#C81E4B",
  "loss-soft": "#FFF1F3",

  line: "#E4E6F0", // hairline borders
  "line-soft": "#EFF0F7",
  fill: "#F2F3F9", // control tracks
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Chart colours, validated with the dataviz palette checker (lightness band,
 * colour-blind separation, normal-vision floor all pass on silk).
 *
 * - Categorical, fixed order, never cycled: indigo → sky → violet → pink.
 *   Royal Indigo itself is too dark for data marks, so marks use a lifted
 *   indigo; Royal Indigo stays the brand anchor (hero numbers, headings).
 * - Sequential: one indigo ramp, light → Royal Indigo, for magnitude.
 * - Polarity (profit / loss): indigo vs rose, around a neutral zero line.
 * Sky and pink sit under 3:1 on silk, so they always ship with visible
 * labels or a legend with values, never colour alone.
 */
export const chart = {
  series: ["#434BB8", "#0FBCF9", "#6C5CE7", "#F78FB3"] as const,
  indigo: "#434BB8",
  sky: "#0FBCF9",
  violet: "#6C5CE7",
  pink: "#F78FB3",
  positive: "#434BB8",
  negative: "#F43F5E",
  /** Sequential indigo ramp, lightest → Royal Indigo. */
  ramp: [
    "#EEEFFA",
    "#D9DBF3",
    "#B9BCE9",
    "#8E93DA",
    "#666DCB",
    "#434BB8",
    "#2D348D",
  ] as const,
  grid: "#EBECF4",
  tick: "#8395A7",
  /** Surface colour used for the 2px gaps and rings between marks. */
  surface: "#FFFFFF",
};

/** Series colours for charts, in brand order. */
export const series = chart.series;
