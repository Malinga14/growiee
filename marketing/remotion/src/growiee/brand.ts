import { loadFont as loadPacifico } from "@remotion/google-fonts/Pacifico";
import { loadFont as loadGoogleSans } from "@remotion/google-fonts/GoogleSans";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
// GROWIEE palette: single source of truth is the branding package.
import colorTokens from "../../../../branding/tokens/color.tokens.json";

const c = colorTokens.color;

export const growiee = {
  indigo: c.brand["royal-indigo"].$value,
  violet: c.brand["soft-violet"].$value,
  sky: c.brand["bright-sky"].$value,
  pink: c.brand["petal-pink"].$value,
  silk: c.base.background.$value,
  slate: c.base.foreground.$value,
  // Tone-on-tone supergraphic shade, a touch deeper than Royal Indigo.
  indigoDeep: "#20266E",
} as const;

export const fonts = {
  // Wordmark: "Growiee", first letter capital only.
  wordmark: loadPacifico().fontFamily,
  // Clean sans for labels and the offer.
  sans: loadGoogleSans("normal", { weights: ["400", "500", "600", "700"] }).fontFamily,
  // Rounded headlines, echoing the round line ends of the elephant mark.
  display: loadNunito("normal", { weights: ["700", "800"] }).fontFamily,
  displayItalic: loadNunito("italic", { weights: ["600"] }).fontFamily,
} as const;
