import React from "react";
import { Img, staticFile } from "remotion";

// Logo assets are exported from the branding package into ./public/logos.
const FILES = {
  light: "logos/growthscope-logo-light.svg",
  mark: "logos/growthscope-mark.svg",
} as const;

export const Logo: React.FC<{
  variant?: keyof typeof FILES;
  width?: number;
  style?: React.CSSProperties;
}> = ({ variant = "light", width = 640, style }) => {
  return (
    <Img
      src={staticFile(FILES[variant])}
      style={{ width, height: "auto", display: "block", ...style }}
    />
  );
};
