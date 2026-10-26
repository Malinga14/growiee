import React from "react";
import { AbsoluteFill } from "remotion";
import { fontFamily } from "../brand";

// Consistent safe-area padding + vertical layout shared by every scene.
export const SceneFrame: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
}> = ({ children, justify = "center", align = "flex-start" }) => {
  return (
    <AbsoluteFill
      style={{
        fontFamily,
        padding: "180px 90px",
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        alignItems: align,
        textAlign: "left",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
