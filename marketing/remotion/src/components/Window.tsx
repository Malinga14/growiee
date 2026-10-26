import React from "react";
import { brand, fontFamily } from "../brand";

// A rounded "app window" card with a title bar and three traffic-light dots —
// the chrome used by the pipeline concept's terminal and code-editor scenes.
export const Window: React.FC<{
  title?: string;
  accent?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, accent = brand.green, children, style }) => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#0c0c0f",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        fontFamily,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "26px 34px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
      >
        <Dot color="#ff5f56" />
        <Dot color="#ffbd2e" />
        <Dot color="#27c93f" />
        {title ? (
          <span
            style={{
              marginLeft: 16,
              color: "rgba(255,255,255,0.45)",
              fontSize: 30,
              fontWeight: 500,
              borderLeft: `4px solid ${accent}`,
              paddingLeft: 16,
            }}
          >
            {title}
          </span>
        ) : null}
      </div>
      <div style={{ padding: "40px 44px" }}>{children}</div>
    </div>
  );
};

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{
      width: 26,
      height: 26,
      borderRadius: "50%",
      backgroundColor: color,
      display: "inline-block",
    }}
  />
);
