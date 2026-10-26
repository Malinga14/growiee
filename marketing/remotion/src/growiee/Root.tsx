import React from "react";
import { Still } from "remotion";
import {
  COLORWAY_OVERVIEW_HEIGHT,
  COLORWAY_OVERVIEW_WIDTH,
  COLORWAY_SIZE,
  colorways,
  LogoColorway,
  LogoColorwayOverview,
} from "./logos/LogoColorways";

// GROWIEE stills. Separate entry point from the Growthscope videos
// (src/index.ts) so the two brands never share palette or fonts.
export const GrowieeRoot: React.FC = () => (
  <>
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
