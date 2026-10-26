// Copies the brand files the Brand page offers (guidelines PDF, logo files,
// mark colourways) from ../branding into public/brand, so the static site
// serves them. Runs before `dev` and `build`; branding/ stays the source.
import { copyFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "branding");
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "brand");
mkdirSync(join(out, "marks"), { recursive: true });

const files = [
  ["brand-guidelines/growiee-brand-guidelines.pdf", "growiee-brand-guidelines.pdf"],
  ["logos/growiee-logo-v2.svg", "growiee-logo.svg"],
  ["logos/growiee-logo-v2.png", "growiee-logo.png"],
  ["logos/growiee-logo-v2.ai", "growiee-logo.ai"],
];
for (const [from, to] of files) {
  const src = join(root, from);
  if (existsSync(src)) copyFileSync(src, join(out, to));
  else console.warn(`sync-brand: missing ${from}`);
}
const marks = join(root, "brand-guidelines", "assets");
for (const f of readdirSync(marks).filter((f) => f.endsWith(".svg"))) {
  copyFileSync(join(marks, f), join(out, "marks", f));
}
console.log(`sync-brand: copied brand files to public/brand`);
