# Growthscope Marketing (as code)

TikTok videos for Growthscope, defined as code with [Remotion](https://remotion.dev).
Every video is a typed data object rendered through an on-brand **template** —
pick a concept, edit text, re-render, ship. No timeline editor required.

## Format

- **1080 × 1920** (9:16 vertical), **30 fps** — TikTok / Reels / Shorts native.
- Branding (colors, typeface, logos) is pulled from the [`branding`](../../branding)
  package so videos always match the site:
  - colors import directly from `../../branding/tokens/growthscope.color.tokens.json`
    (GROWIEE stills in `src/growiee/` use `../../branding/tokens/color.tokens.json`)
  - logos are exported into `public/logos/`
  - typeface is **Outfit** via `@remotion/google-fonts`

## Quick start

```bash
cd marketing/remotion
npm install
npm run dev          # opens Remotion Studio to preview/scrub videos
```

Render an MP4:

```bash
npm run render <video-id> out/<video-id>.mp4
npm run render:all   # renders every video in videos.ts (targets are auto-derived)
```

> Rendering requires the dependencies Remotion downloads on first run (a headless
> Chromium). `npm install` followed by the first `render`/`studio` handles this.

## Templates vs. videos

There are two levels:

- A **template** is a *concept* — a self-contained set of scenes and animations
  with its own editable schema (e.g. `story`, `pipeline`).
- A **video** is one *instance* of a template — an id plus the data (props) that
  fill it in.

Many videos can share one template; adding a new look means adding a template.

### Available templates

| Template   | Concept                          | Scenes                                                        |
| ---------- | -------------------------------- | ------------------------------------------------------------- |
| `story`    | Classic hook → value props → CTA | LogoIntro → Hook (cycling words) → Points → CTA               |
| `pipeline` | "Marketing as code" / automation | Terminal intro → Statement → Code editor → Automation pipeline → CTA |

## How it's structured

```
marketing/remotion/
├── remotion.config.ts        # render defaults (codec, format, entry)
├── scripts/render-all.mjs    # renders every composition (targets auto-derived)
├── public/logos/             # brand logos served via staticFile()
└── src/
    ├── index.ts              # registerRoot
    ├── Root.tsx              # one <Composition> per entry, via the template registry
    ├── videos.ts             # ← the content: {id, template, props} per video
    ├── timing.ts             # shared canvas (size, fps)
    ├── brand.ts              # brand colors + Outfit font (from /branding)
    ├── components/           # shared: Background, GridBackground, Logo,
    │                         #         HighlightBlock, SceneFrame, Window, Typewriter
    └── templates/
        ├── index.ts          # the template registry
        ├── types.ts          # TemplateModule type + defineTemplate()
        ├── story/            # the "story" concept
        │   ├── index.ts      #   schema + Component + data-driven duration
        │   ├── schema.ts     #   editable props (zod)
        │   ├── timing.ts     #   scene lengths
        │   ├── StoryVideo.tsx
        │   └── scenes/       #   LogoIntro, HookScene, PointsScene, CtaScene
        └── pipeline/         # the "pipeline" concept (same shape)
            ├── index.ts
            ├── schema.ts
            ├── timing.ts
            ├── PipelineVideo.tsx
            └── scenes/       #   TerminalIntro, StatementScene, CodeScene,
                              #   PipelineScene, CtaScene
```

Video length is derived from the data — add a point/code line/pipeline stage and
the composition grows automatically (each template exports a `duration(props)`;
`Root.tsx` feeds it to `calculateMetadata`).

## Add a new video

Add an entry to `src/videos.ts`, choosing a `template`. `props` is type-checked
against that template's schema:

```ts
{
  id: "growthscope-seo-tips",
  template: "story",
  props: {
    headline: "Stop guessing at SEO.",
    hookWords: ["rank", "traffic", "leads"],
    points: [
      { title: "Audit", body: "Find what's holding you back." },
      { title: "Content", body: "Answer what people search for." },
    ],
    cta: "Get found on Google.",
    handle: "@growthscope",
  },
},
```

It appears as a new composition in the Studio and a new render target (picked up
automatically by `render:all`) — no component changes needed. Editing props live
in the Studio sidebar is backed by the template's `schema.ts`.

## Add a new template (a new concept / set of animations)

1. Create `src/templates/<name>/` with a `schema.ts` (zod props), a composition
   component, a `timing.ts`, its `scenes/`, and an `index.ts` that wires them up
   with `defineTemplate`:

   ```ts
   export const myTemplate = defineTemplate<MyProps>({
     schema: mySchema,
     Component: MyVideo,
     duration: (props) => /* frames, derived from props */,
   });
   ```

2. Register it in `src/templates/index.ts`:

   ```ts
   export const templates = { story: storyTemplate, pipeline: pipelineTemplate, my: myTemplate };
   ```

3. Add the `"my"` arm to the `VideoEntry` union in `src/videos.ts`, then add
   videos that use it.

Reuse the shared brand primitives in `src/components` (logo, highlight block,
typewriter, window chrome, backgrounds) so every concept still reads as
Growthscope.

## GROWIEE stills

GROWIEE social posts live in `src/growiee/` (assets in `public/growiee/`) and
show up in the Studio next to the Growthscope videos. Render one alone with the
GROWIEE entry point:

```bash
# Instagram feed post: 1080 x 1350 JPEG, Instagram-ready
npx remotion still src/growiee/index.ts growiee-ig-post-01-offer out/growiee-ig-post-01-offer.jpg --image-format=jpeg --jpeg-quality=92

# Facebook posts: 2x PNG for extra sharpness
npx remotion still src/growiee/index.ts growiee-fb-post-04-premium-v6-secondary out/post.png --scale=2
```

Change the price with `--props='{"price":"1,700"}'`.

## Notes / next steps

- Add background music or voiceover with Remotion's `<Audio>` (drop files in `public/`).
- For automated publishing, render in CI and push to the TikTok Content Posting API.
- Keep colors in sync by editing the `branding` tokens — this package reads them directly.
```
