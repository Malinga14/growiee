// Renders every composition to out/<id>.mp4.
//
// The render targets are derived from Remotion itself (which reads
// src/videos.ts), so adding a video to videos.ts is the *only* step needed —
// there is no hand-maintained list of ids or output paths here.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const ENTRY = "src/index.ts";
const OUT_DIR = "out";

mkdirSync(OUT_DIR, { recursive: true });

// Ask Remotion for the available compositions and pull the id from each row
// (id is the first column, followed by fps and a WxH dimension).
const listing = execFileSync("npx", ["remotion", "compositions", ENTRY], {
  encoding: "utf8",
});

const ids = listing
  .split("\n")
  .map((line) => line.trim().match(/^([a-z0-9][\w-]*)\s+\d+\s+\d+x\d+/i))
  .filter((match) => match !== null)
  .map((match) => match[1]);

if (ids.length === 0) {
  console.error("No compositions found — is src/videos.ts empty?");
  process.exit(1);
}

console.log(`Rendering ${ids.length} video(s): ${ids.join(", ")}`);
for (const id of ids) {
  console.log(`\n→ ${id}`);
  execFileSync("npx", ["remotion", "render", id, `${OUT_DIR}/${id}.mp4`], {
    stdio: "inherit",
  });
}
