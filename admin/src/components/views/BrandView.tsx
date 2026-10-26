"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import brandTokens from "../../../../branding/tokens/brand.tokens.json";
import colorTokens from "../../../../branding/tokens/color.tokens.json";
import productTokens from "../../../../branding/tokens/product.tokens.json";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/layout/Logo";
import Card from "@/components/ui/Card";
import { snappy } from "@/lib/motion";

const brand = brandTokens.brand;
const palette = colorTokens.color;

const COLOURS = [
  { name: "Royal Indigo", ...palette.brand["royal-indigo"], text: "#FDFDFD" },
  { name: "Soft Violet", ...palette.brand["soft-violet"], text: "#FDFDFD" },
  { name: "Bright Sky", ...palette.brand["bright-sky"], text: "#222F3E" },
  { name: "Petal Pink", ...palette.brand["petal-pink"], text: "#222F3E" },
  { name: "Off-White Silk", ...palette.base.background, text: "#222F3E" },
  { name: "Midnight Slate", ...palette.base.foreground, text: "#FDFDFD" },
];

/** Approved mark colourways: each mark on a background it reads on. */
const MARKS = [
  { file: "mark-indigo.svg", name: "Royal Indigo on Silk", bg: "#FDFDFD" },
  { file: "mark-silk.svg", name: "Silk on Royal Indigo", bg: "#2D348D" },
  { file: "mark-violet.svg", name: "Soft Violet on Silk", bg: "#FDFDFD" },
  { file: "mark-pink.svg", name: "Petal Pink on Royal Indigo", bg: "#2D348D" },
  { file: "mark-sky.svg", name: "Bright Sky on Midnight Slate", bg: "#222F3E" },
  { file: "mark-slate.svg", name: "Midnight Slate on Silk", bg: "#FDFDFD" },
];

const PILLARS = Object.values(brand.pillar).filter(
  (p): p is { title: { $value: string }; body: { $value: string } } =>
    typeof p === "object" && p !== null && "title" in p,
);

const CLAIMS = Object.values(productTokens.product.claim)
  .filter(
    (c): c is { $value: string } => typeof c === "object" && "$value" in c,
  )
  .map((c) => c.$value);

/**
 * Brand: the guidelines, logo files, mark colourways, colours, type and
 * pillars, all read from branding/ (tokens directly; files are copied into
 * public/brand by scripts/sync-brand.mjs), so it always matches the source.
 */
export default function BrandView() {
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(t);
  }, [toast]);

  async function copy(hex: string, name: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setToast(`${name} ${hex} copied`);
    } catch {
      setToast(hex);
    }
  }

  return (
    <div className="space-y-6">
      {/* Guidelines */}
      <section
        data-reveal
        className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(155deg,#2D348D_0%,#3D3FB0_50%,#6C5CE7_100%)] p-6 text-white shadow-[0_30px_60px_-30px_rgba(45,52,141,0.55)] sm:p-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 [color:#fff]" />
              <span className="font-wordmark text-[28px] leading-none">
                Growiee
              </span>
            </div>
            <p className="mt-8 text-xs font-medium uppercase tracking-[0.14em] text-white/65">
              Brand guidelines
            </p>
            <h2 className="mt-2 font-display text-[32px] font-light leading-tight tracking-display sm:text-[40px]">
              {brand.tagline.$value}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {brand.mission.$value}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href="/brand/growiee-brand-guidelines.pdf"
              target="_blank"
              rel="noreferrer"
              className="pressable inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <Icon icon="book" active className="h-[18px] w-[18px]" />
              Open guidelines
            </a>
            <a
              href="/brand/growiee-brand-guidelines.pdf"
              download
              className="pressable inline-flex h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Download PDF
            </a>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* Logo files */}
        <Card
          title="Logo"
          icon="brand"
          subtitle="The line-art elephant mark. Set the name beside it in Pacifico."
        >
          <div className="grid place-items-center rounded-2xl bg-canvas px-6 py-10 ring-1 ring-inset ring-ink/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/growiee-logo.svg"
              alt="Growiee logo"
              className="h-28 w-auto"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["SVG", "growiee-logo.svg", "Web and print"],
              ["PNG", "growiee-logo.png", "2000 px"],
              ["AI", "growiee-logo.ai", "Illustrator"],
            ].map(([label, file, note]) => (
              <a
                key={file}
                href={`/brand/${file}`}
                download
                className="pressable flex min-w-[110px] flex-1 flex-col rounded-2xl bg-white/70 px-4 py-3 outline-none ring-1 ring-inset ring-ink/[0.06] transition-colors hover:bg-white hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="text-sm font-semibold text-ink">{label}</span>
                <span className="text-xs text-ink-faint">{note}</span>
              </a>
            ))}
          </div>
        </Card>

        {/* Mark colourways */}
        <Card
          title="Mark colourways"
          icon="highlights"
          iconTone="violet"
          subtitle="Approved colour versions. Click one to download its SVG."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MARKS.map((m) => (
              <a
                key={m.file}
                href={`/brand/marks/${m.file}`}
                download
                className="pressable group overflow-hidden rounded-2xl outline-none ring-1 ring-inset ring-ink/[0.06] focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div
                  className="grid aspect-[4/3] place-items-center"
                  style={{ backgroundColor: m.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/brand/marks/${m.file}`}
                    alt={m.name}
                    className="h-14 w-auto transition-transform duration-300 ease-ios group-hover:scale-105"
                  />
                </div>
                <p className="truncate bg-white/80 px-3 py-2 text-xs text-ink-muted">
                  {m.name}
                </p>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* Colours */}
      <Card
        title="Colour"
        icon="palette"
        iconTone="sky"
        subtitle="Click a colour to copy its hex code"
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {COLOURS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => copy(c.$value, c.name)}
              className="pressable group overflow-hidden rounded-2xl text-left outline-none ring-1 ring-inset ring-ink/[0.06] focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div
                className="flex h-28 items-end justify-between p-3"
                style={{ backgroundColor: c.$value, color: c.text }}
              >
                <span className="font-display text-2xl font-extrabold">Aa</span>
                <span className="text-[11px] font-semibold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  Copy
                </span>
              </div>
              <div className="bg-white/80 px-3 py-2.5">
                <p className="text-sm font-semibold text-ink">{c.name}</p>
                <p className="tabular text-xs text-ink-muted">{c.$value}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-ink-faint">
                  {c.$description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Typography */}
        <Card
          title="Typography"
          icon="typography"
          subtitle="Three families, each with one job"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <Specimen
              family="Pacifico"
              role="Wordmark only"
              sample={
                <span className="font-wordmark text-5xl text-primary">
                  Growiee
                </span>
              }
            />
            <Specimen
              family="Nunito"
              role="Headlines · 700–800"
              sample={
                <span className="font-display text-4xl font-extrabold text-heading">
                  Soft first
                </span>
              }
            />
            <Specimen
              family="Google Sans"
              role="Body & UI · 400–700"
              sample={
                <span className="font-sans text-[15px] leading-relaxed text-ink">
                  Ultra-soft combed cotton, made for the first nine months.
                </span>
              }
            />
          </div>
        </Card>

        {/* Pillars and claims */}
        <Card title="Brand pillars" icon="check" iconTone="pink">
          <ol className="space-y-4">
            {PILLARS.map((p, i) => (
              <li key={p.title.$value} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {p.title.$value}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {p.body.$value}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/[0.06] pt-4">
            {CLAIMS.map((c) => (
              <span
                key={c}
                className="rounded-full bg-sky-soft px-3 py-1 text-xs font-medium text-sky-strong"
              >
                {c}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={snappy}
            className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Specimen({
  family,
  role,
  sample,
}: {
  family: string;
  role: string;
  sample: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[180px] flex-col justify-between rounded-2xl bg-white/70 p-4 ring-1 ring-inset ring-ink/[0.06]">
      <div>{sample}</div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-ink">{family}</p>
        <p className="text-xs text-ink-faint">{role}</p>
      </div>
    </div>
  );
}
