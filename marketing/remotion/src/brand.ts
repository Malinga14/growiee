import { loadFont } from "@remotion/google-fonts/Outfit";
// Growthscope palette (kept here; branding/ holds only Growiee assets).
import colorTokens from "./growthscope.color.tokens.json";

const c = colorTokens.color;

export const brand = {
  yellow: c.brand.yellow.$value,
  blue: c.brand.blue.$value,
  green: c.brand.green.$value,
  pink: c.brand.pink.$value,
  background: c.base.background.$value,
  foreground: c.base.foreground.$value,
  neutral800: c.neutral["800"].$value,
} as const;

// Colors used for the signature "yellow type on a solid block" treatment.
export const highlightColors = [brand.blue, brand.green, brand.pink] as const;

// Load Outfit (the Growthscope typeface) for use in compositions.
const { fontFamily } = loadFont("normal", {
  weights: ["300", "400", "500", "600", "700", "800"],
});

export { fontFamily };
