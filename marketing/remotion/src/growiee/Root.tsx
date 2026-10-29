import React from "react";
import { Folder, Still } from "remotion";
import {
  COLORWAY_OVERVIEW_HEIGHT,
  COLORWAY_OVERVIEW_WIDTH,
  COLORWAY_SIZE,
  colorways,
  LogoColorway,
  LogoColorwayOverview,
} from "./logos/LogoColorways";
import { FacebookBanner, FB_BANNER_HEIGHT, FB_BANNER_WIDTH } from "./social/FacebookBanner";
import { bannerSet } from "./social/FacebookBannerSet";
import { logoBannerSet } from "./social/FacebookBannerLogo";
import { textureBannerSet } from "./social/FacebookBannerTexture";
import { BannerSupergraphicV2, BannerSupergraphicV3 } from "./social/FacebookBannerSupergraphic";
import { BannerFlourish } from "./social/FacebookBannerFlourish";
import { BAG_HEIGHT, BAG_WIDTH, BOARD_HEIGHT, BOARD_WIDTH, CourierBagBoard, CourierBagFront } from "./packaging/CourierBag";

// GROWIEE stills. Separate entry point from the Growthscope videos
// (src/index.ts) so the two brands never share palette or fonts.
// Grouped into Studio folders, newest cover first. Composition ids are
// unchanged, so render commands keep working.

const Cover: React.FC<{ id: string; component: React.FC<any>; defaultProps?: Record<string, unknown> }> = ({
  id,
  component,
  defaultProps,
}) => (
  <Still
    id={`growiee-facebook-banner-${id}`}
    component={component}
    width={FB_BANNER_WIDTH}
    height={FB_BANNER_HEIGHT}
    defaultProps={defaultProps}
  />
);

export const GrowieeRoot: React.FC = () => (
  <>
    {/* Latest cover: v12 silk ribbons. */}
    <Folder name="Growiee-Facebook-cover-latest">
      <Cover id="flourish-ribbons" component={BannerFlourish} defaultProps={{ variant: "ribbons" }} />
    </Folder>

    {/* Every earlier cover version, oldest first. */}
    <Folder name="Growiee-Facebook-cover-versions">
      {(["silk", "indigo"] as const).map((theme) => (
        <Cover key={theme} id={theme} component={FacebookBanner} defaultProps={{ theme }} />
      ))}
      {[
        ...bannerSet,
        ...logoBannerSet,
        ...textureBannerSet,
        { id: "supergraphic-v2", component: BannerSupergraphicV2 },
        { id: "supergraphic-v3", component: BannerSupergraphicV3 },
      ].map((b) => (
        <Cover key={b.id} id={b.id} component={b.component} />
      ))}
    </Folder>

    {/* Pattern explorations that led to v12. */}
    <Folder name="Growiee-Facebook-cover-drafts">
      {(["curls", "threads"] as const).map((variant) => (
        <Cover key={variant} id={`flourish-${variant}`} component={BannerFlourish} defaultProps={{ variant }} />
      ))}
    </Folder>

    {/* Courier mailer v2, milk and purple bags: front print artwork (100 px/in, render --scale=3) plus a presentation board. */}
    <Folder name="Growiee-courier-bag">
      <Still id="growiee-courier-bag-v2-front" component={CourierBagFront} width={BAG_WIDTH} height={BAG_HEIGHT} />
      <Still id="growiee-courier-bag-v2-board" component={CourierBagBoard} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
      <Still
        id="growiee-courier-bag-v2-purple-front"
        component={CourierBagFront}
        width={BAG_WIDTH}
        height={BAG_HEIGHT}
        defaultProps={{ bag: "purple" as const }}
      />
      <Still
        id="growiee-courier-bag-v2-purple-board"
        component={CourierBagBoard}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        defaultProps={{ bag: "purple" as const }}
      />
    </Folder>

    {/* Colour versions of the current logo mark: one still each plus an overview. */}
    <Folder name="Growiee-logo-colourways">
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
    </Folder>
  </>
);
