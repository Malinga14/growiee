---
version: alpha
name: Growiee
description: Gentle, premium design system for Growiee, a Sri Lankan D2C baby apparel brand (0–9 months). Royal Indigo on soft silk with Soft Violet, Bright Sky and Petal Pink accents, a line-art elephant mark, Pacifico wordmark, Nunito headlines and Google Sans text, built to Apple HIG, Material Design 3 and WCAG 2.2.
---

# Growiee Design System

## Overview

Growiee makes ultra-soft, non-toxic 100% combed cotton 3-piece sets for babies from newborn to 9 months, sold direct to parents and gift-givers across Sri Lanka through Facebook, Instagram, WhatsApp and growiee.com.

The look is **calm, gentle and quietly premium**: deep Royal Indigo on airy Off-White Silk, lifted by three fresh accents (Soft Violet, Bright Sky, Petal Pink), generous white space, soft rounded shapes and one flowing line-art elephant. It should feel like a well-made gift box, not a toy shop. Nothing is loud, glossy or crowded; one idea per screen or post.

- **Logo:** the line-art elephant mark (`branding/logos/growiee-logo-v2.svg`), a single monoline stroke with an ear spiral and curled trunk. Pair it with the wordmark "Growiee" set in Pacifico, in the same flat colour as the mark.
- **Name:** always written "Growiee", capital G only, never all caps in designs.
- **Audience:** expecting and new parents, grandparents and gift buyers; mobile-first (social commerce and WhatsApp), so every screen is designed for a 360–430px phone first.
- **Tagline:** "Gentle First Steps. Comfort That Grows With Them."

## Colors

Royal Indigo anchors the brand on Off-White Silk; three fresh accents bring joy; Midnight Slate carries the text.

- **Primary, Royal Indigo (#2D348D):** logo, headlines, primary buttons, packaging exteriors. Off-White Silk on it is 10.4:1.
- **Secondary, Soft Violet (#6C5CE7):** promotional blocks, secondary buttons, offer highlights, boy/unisex tags. Off-White Silk text on it is 4.8:1 (AA); never Midnight Slate text on it (2.8:1).
- **Tertiary, Bright Sky (#0FBCF9):** trust badges ("100% Combed Cotton"), info highlights, WhatsApp/action buttons. Text on it is Midnight Slate (6.2:1) or Royal Indigo (4.8:1); never Off-White Silk (2.2:1).
- **Accent, Petal Pink (#F78FB3):** gift ribbons, girl/unisex tags, gentle highlight badges, warm backgrounds. Text on it is Midnight Slate (6.2:1) or Royal Indigo (4.8:1); never Off-White Silk (2.2:1).
- **Surface, Off-White Silk (#FDFDFD):** page, card and social canvas background.
- **On-surface, Midnight Slate (#222F3E):** body text, size charts, care labels and dark backgrounds (13.4:1 on silk).

```yaml
colors:
  primary: "#2D348D"
  on-primary: "#FDFDFD"
  primary-pressed: "#232A73"
  secondary: "#6C5CE7"
  on-secondary: "#FDFDFD"
  secondary-pressed: "#5C4EC4"
  tertiary: "#0FBCF9"
  on-tertiary: "#222F3E"
  accent: "#F78FB3"
  on-accent: "#222F3E"
  surface: "#FDFDFD"
  surface-muted: "#F5F5F5"
  on-surface: "#222F3E"
  on-surface-muted: "#576574"
  outline: "#D4D4D4"
  error: "#B42318"
  on-error: "#FDFDFD"
```

## Typography

Three families, each with one job. All are free Google Fonts (OFL).

- **Pacifico:** the wordmark "Growiee" only, large and flat in the mark's colour. Never for headlines or body.
- **Nunito:** headlines and short emotional lines; its rounded terminals echo the round line ends of the elephant mark.
- **Google Sans:** body, UI, prices, labels and size charts; open, friendly and highly legible at small sizes. Uppercase labels use wide tracking.

Text must scale with the platform's text-size setting (iOS Dynamic Type, Android font scale); never fix body text below 16px on mobile.

```yaml
typography:
  wordmark:
    fontFamily: Pacifico
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.1
  headline-display:
    fontFamily: Nunito
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Nunito
    fontSize: 32px
    fontWeight: 800
    lineHeight: 1.2
  headline-md:
    fontFamily: Nunito
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
  body-lg:
    fontFamily: Google Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Google Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Google Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: Google Sans
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
  label-md:
    fontFamily: Google Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Google Sans
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.18em
```

## Layout

Mobile-first. Phones use a fluid 4-column grid with 16px side margins; tablets 8 columns; desktop a 12-column grid capped at 1200px with 32px margins. Spacing follows a 4px base with an 8px rhythm (Material 3 and Apple HIG both align to it).

- Respect safe areas (iOS notch/home indicator, Android system bars); never place actions under them.
- Interactive targets are at least **48×48px** (Material 48dp; covers Apple's 44pt and WCAG 2.2's 24px minimum), with at least 8px between neighbouring targets.
- Social canvases: 1080×1350 (Instagram/Facebook 4:5) and 1080×1080; keep logo and text inside the central 80%.

```yaml
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  touch-target: 48px
  max-width: 1200px
```

## Elevation & Depth

Depth comes from **tonal layers**, not heavy shadows: silk page, white or muted cards, indigo for the one emphasised block. When a shadow is needed (sheets, menus, a lifted product card) use one soft, low shadow: `0 8px 24px rgba(0,4,13,0.08)`. No glows, no gradients behind the logo, no glossy effects.

## Shapes

Soft and rounded, echoing the round elephant and cotton. Buttons and chips are fully rounded pills; cards and images use 20px corners; inputs 12px.

```yaml
rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 20px
  xl: 28px
  full: 9999px
```

## Components

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 16px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 16px
  button-whatsapp:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 16px
  badge-trust:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
  badge-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
    padding: 8px
  button-secondary-pressed:
    backgroundColor: "{colors.secondary-pressed}"
  chip-size:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 16px
  chip-size-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  card-product:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 16px
```

- **Buttons:** one primary (Royal Indigo) action per screen, e.g. "Add 3-Kit to cart". Secondary actions use Soft Violet; WhatsApp ordering uses Bright Sky with Midnight Slate text.
- **Size chips:** NB · 0–3M · 3–6M · 6–9M; selected chip turns Royal Indigo.
- **Badges:** trust claims (100% Combed Cotton, AZO-Free Dyes, Nickel-Free Snaps) in Bright Sky; gentle highlights in Petal Pink; offers in Soft Violet.
- **Product card:** square image with 20px corners, Nunito name, Google Sans price in LKR, size chips below.
- **Focus:** every interactive element shows a visible 2px Royal Indigo focus ring with 2px offset (WCAG 2.2, 2.4.11/2.4.13).

## Do's and Don'ts

- Do keep the elephant mark and the Pacifico wordmark the same flat colour.
- Do write "Growiee" with only the G capitalised.
- Do keep clear space of at least x on every side of the logo, where x is a quarter of the mark's height.
- Do maintain WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text and icons.
- Do design every screen for a phone first, with 48px touch targets and safe areas respected.
- Do honour reduced-motion settings; keep motion soft (200–300ms, ease-out).
- Don't stretch, rotate, outline, add shadows or glows to the logo.
- Don't put Off-White Silk text on Bright Sky or Petal Pink (only 2.2:1), or Midnight Slate text on Soft Violet (2.8:1).
- Don't use more than one primary button, or more than two of the three accents (Violet, Sky, Pink) in one view.
- Don't use stock-cute clichés (storks, rattles, rainbow gradients); let the elephant and soft space carry the warmth.
