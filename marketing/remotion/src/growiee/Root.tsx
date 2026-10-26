import React from "react";
import { Still } from "remotion";
import { POST_HEIGHT, POST_WIDTH, WelcomeOfferPost } from "./posts/WelcomeOfferPost";
import { OFFER_POST_HEIGHT, OFFER_POST_WIDTH, SpecialOfferPost } from "./posts/SpecialOfferPost";
import { OFFER_V2_HEIGHT, OFFER_V2_WIDTH, SpecialOfferPostV2 } from "./posts/SpecialOfferPostV2";
import { PREMIUM_HEIGHT, PREMIUM_WIDTH, PremiumOfferPost } from "./posts/PremiumOfferPost";
import { PREMIUM_SEC_HEIGHT, PREMIUM_SEC_WIDTH, PremiumOfferPostSecondary } from "./posts/PremiumOfferPostSecondary";
import { PREMIUM_SEC3_HEIGHT, PREMIUM_SEC3_WIDTH, PremiumOfferPostSecondaryV3 } from "./posts/PremiumOfferPostSecondaryV3";
import { PREMIUM_SEC4_HEIGHT, PREMIUM_SEC4_WIDTH, PremiumOfferPostSecondaryV4 } from "./posts/PremiumOfferPostSecondaryV4";
import { PREMIUM_SEC5_HEIGHT, PREMIUM_SEC5_WIDTH, PremiumOfferPostSecondaryV5 } from "./posts/PremiumOfferPostSecondaryV5";
import { PREMIUM_SEC6_HEIGHT, PREMIUM_SEC6_WIDTH, PremiumOfferPostSecondaryV6 } from "./posts/PremiumOfferPostSecondaryV6";
import { PREMIUM_V7_HEIGHT, PREMIUM_V7_WIDTH, PremiumOfferPostV7 } from "./posts/PremiumOfferPostV7";
import { PREMIUM_V8_HEIGHT, PREMIUM_V8_WIDTH, PremiumOfferPostV8 } from "./posts/PremiumOfferPostV8";
import {
  COLORWAY_OVERVIEW_HEIGHT,
  COLORWAY_OVERVIEW_WIDTH,
  COLORWAY_SIZE,
  colorways,
  LogoColorway,
  LogoColorwayOverview,
} from "./logos/LogoColorways";

// GROWIEE social stills. Separate entry point from the Growthscope videos
// (src/index.ts) so the two brands never share palette or fonts.
export const GrowieeRoot: React.FC = () => (
  <>
    <Still
      id="growiee-fb-post-01-offer"
      component={WelcomeOfferPost}
      width={POST_WIDTH}
      height={POST_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    <Still
      id="growiee-fb-post-02-special-offer"
      component={SpecialOfferPost}
      width={OFFER_POST_WIDTH}
      height={OFFER_POST_HEIGHT}
      defaultProps={{ price: "1,700", letters: "blush" as const }}
    />
    <Still
      id="growiee-fb-post-02-special-offer-ocean"
      component={SpecialOfferPost}
      width={OFFER_POST_WIDTH}
      height={OFFER_POST_HEIGHT}
      defaultProps={{ price: "1,700", letters: "ocean" as const }}
    />
    <Still
      id="growiee-fb-post-03-offer-blush"
      component={SpecialOfferPostV2}
      width={OFFER_V2_WIDTH}
      height={OFFER_V2_HEIGHT}
      defaultProps={{ price: "1,700", theme: "blush" as const }}
    />
    <Still
      id="growiee-fb-post-03-offer-indigo"
      component={SpecialOfferPostV2}
      width={OFFER_V2_WIDTH}
      height={OFFER_V2_HEIGHT}
      defaultProps={{ price: "1,700", theme: "indigo" as const }}
    />
    <Still
      id="growiee-fb-post-04-premium"
      component={PremiumOfferPost}
      width={PREMIUM_WIDTH}
      height={PREMIUM_HEIGHT}
      defaultProps={{ price: "1,700", version: "v1" as const }}
    />
    <Still
      id="growiee-fb-post-04-premium-v2"
      component={PremiumOfferPost}
      width={PREMIUM_WIDTH}
      height={PREMIUM_HEIGHT}
      defaultProps={{ price: "1,700", version: "v2" as const }}
    />
    <Still
      id="growiee-fb-post-04-premium-v2-secondary"
      component={PremiumOfferPostSecondary}
      width={PREMIUM_SEC_WIDTH}
      height={PREMIUM_SEC_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    <Still
      id="growiee-fb-post-04-premium-v3-secondary"
      component={PremiumOfferPostSecondaryV3}
      width={PREMIUM_SEC3_WIDTH}
      height={PREMIUM_SEC3_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    <Still
      id="growiee-fb-post-04-premium-v4-secondary"
      component={PremiumOfferPostSecondaryV4}
      width={PREMIUM_SEC4_WIDTH}
      height={PREMIUM_SEC4_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    <Still
      id="growiee-fb-post-04-premium-v5-secondary"
      component={PremiumOfferPostSecondaryV5}
      width={PREMIUM_SEC5_WIDTH}
      height={PREMIUM_SEC5_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    <Still
      id="growiee-fb-post-04-premium-v6-secondary"
      component={PremiumOfferPostSecondaryV6}
      width={PREMIUM_SEC6_WIDTH}
      height={PREMIUM_SEC6_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    {/* Instagram feed post: same v6 design at Instagram's 1080 x 1350 (4:5).
        Render as JPEG at scale 1 (see README, "GROWIEE stills"). */}
    <Still
      id="growiee-ig-post-01-offer"
      component={PremiumOfferPostSecondaryV6}
      width={1080}
      height={1350}
      defaultProps={{ price: "1,700" }}
    />
    <Still
      id="growiee-fb-post-04-premium-v7"
      component={PremiumOfferPostV7}
      width={PREMIUM_V7_WIDTH}
      height={PREMIUM_V7_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    <Still
      id="growiee-fb-post-04-premium-v8"
      component={PremiumOfferPostV8}
      width={PREMIUM_V8_WIDTH}
      height={PREMIUM_V8_HEIGHT}
      defaultProps={{ price: "1,700" }}
    />
    {/* Colour versions of the current logo mark: one still each plus an overview. */}
    <Still
      id="growiee-logo-colorways-overview"
      component={LogoColorwayOverview}
      width={COLORWAY_OVERVIEW_WIDTH}
      height={COLORWAY_OVERVIEW_HEIGHT}
    />
    {colorways.map((c, index) => (
      <Still
        key={c.id}
        id={`growiee-logo-colorway-${String(index + 1).padStart(2, "0")}-${c.id}`}
        component={LogoColorway}
        width={COLORWAY_SIZE}
        height={COLORWAY_SIZE}
        defaultProps={{ index }}
      />
    ))}
  </>
);
