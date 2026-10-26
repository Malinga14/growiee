import React from "react";
import { useCurrentFrame } from "remotion";
import { brand } from "../../../brand";
import { SceneFrame } from "../../../components/SceneFrame";
import { Window } from "../../../components/Window";
import { Cursor } from "../../../components/Typewriter";
import { SCENE } from "../timing";

const mono = '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Consolas, monospace';

const COLOR = {
  comment: "rgba(255,255,255,0.4)",
  string: brand.green,
  key: brand.yellow,
  plain: "rgba(255,255,255,0.9)",
} as const;

type Token = { text: string; color: string };

// Light YAML-ish tokeniser: comments, quoted strings, and `key:` labels.
const tokenize = (line: string): Token[] => {
  const lead = (line.match(/^\s*/) ?? [""])[0];
  const rest = line.slice(lead.length);
  const tokens: Token[] = [];
  if (lead) tokens.push({ text: lead, color: COLOR.plain });
  if (rest.startsWith("#")) {
    tokens.push({ text: rest, color: COLOR.comment });
    return tokens;
  }
  rest.split(/("[^"]*")/g).forEach((segment, i) => {
    if (!segment) return;
    if (i % 2 === 1) {
      tokens.push({ text: segment, color: COLOR.string });
      return;
    }
    segment.split(/([\w.-]+:)/g).forEach((part) => {
      if (!part) return;
      tokens.push({ text: part, color: /^[\w.-]+:$/.test(part) ? COLOR.key : COLOR.plain });
    });
  });
  return tokens;
};

// Renders a line's tokens truncated to `visible` characters (the typing edge).
const renderTokens = (tokens: Token[], visible: number): React.ReactNode => {
  let remaining = visible;
  return tokens.map((token, i) => {
    if (remaining <= 0) return null;
    const text = token.text.slice(0, remaining);
    remaining -= text.length;
    return (
      <span key={i} style={{ color: token.color }}>
        {text}
      </span>
    );
  });
};

const Line: React.FC<{ line: string; index: number }> = ({ line, index }) => {
  const frame = useCurrentFrame();
  const start = index * SCENE.codePerLine;
  const framesPerChar = 0.7;
  const elapsed = Math.max(0, frame - start);
  const visible = Math.min(line.length, Math.floor(elapsed / framesPerChar));
  const started = frame >= start;
  const typing = started && visible < line.length;

  if (!started) return <div style={{ minHeight: "1.5em" }} />;

  const tokens = tokenize(line);
  return (
    <div style={{ minHeight: "1.5em", whiteSpace: "pre" }}>
      <span style={{ color: "rgba(255,255,255,0.25)", marginRight: 28 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      {renderTokens(tokens, visible)}
      {typing ? <Cursor color={brand.yellow} blink={false} /> : null}
    </div>
  );
};

// A config file that types itself out — "marketing as code", literally.
export const CodeScene: React.FC<{ codeTitle: string; codeLines: string[] }> = ({
  codeTitle,
  codeLines,
}) => {
  return (
    <SceneFrame justify="center" align="center">
      <Window title={codeTitle} accent={brand.yellow}>
        <div style={{ fontFamily: mono, fontSize: 36, lineHeight: 1.5 }}>
          {codeLines.map((line, i) => (
            <Line key={i} line={line} index={i} />
          ))}
        </div>
      </Window>
    </SceneFrame>
  );
};
