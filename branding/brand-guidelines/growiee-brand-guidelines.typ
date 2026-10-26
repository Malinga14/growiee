// Growiee Brand Guidelines 2026
// Build from the repo root:
//   typst compile --root . --font-path branding/brand-guidelines/fonts \
//     branding/brand-guidelines/growiee-brand-guidelines.typ branding/brand-guidelines/growiee-brand-guidelines.pdf

// ---------------------------------------------------------------- tokens
#let indigo = rgb("#2D348D")
#let indigo-deep = rgb("#232A73")
#let pink = rgb("#F78FB3")
#let sky = rgb("#0FBCF9")
#let violet = rgb("#6C5CE7")
#let silk = rgb("#FDFDFD")
#let slate = rgb("#222F3E")
#let muted = rgb("#576574")
#let hair = rgb("#E5E5E5")
#let soft = rgb("#F5F5F5")
#let warn = rgb("#B42318")

#let A = "/branding/brand-guidelines/assets/"
#let P = "/marketing/remotion/public/growiee/"

// ---------------------------------------------------------------- page + type
#set document(title: "Growiee Brand Guidelines 2026", author: "Growiee")
#set text(font: "Google Sans", size: 10pt, fill: slate, weight: 400)
#set par(leading: 0.7em, justify: false)
#set page(
  paper: "a4", flipped: true, fill: silk,
  margin: (x: 18mm, top: 16mm, bottom: 18mm),
  footer: context {
    set text(size: 7pt, fill: muted, tracking: 0.12em)
    grid(columns: (1fr, auto), upper[Growiee · Brand Guidelines 2026],
      str(counter(page).get().first()))
  },
)

#let caps(body, fill: indigo, size: 7.5pt) = text(size: size, weight: 600, tracking: 0.18em, fill: fill, upper(body))
#let display(body, size: 24pt, fill: indigo, weight: 800) = text(font: "Nunito", size: size, weight: weight, fill: fill, body)
#let body-copy(body, fill: slate, size: 10pt) = text(size: size, fill: fill, body)

#let mark(col, h) = image(A + "mark-" + col + ".svg", height: h)
#let wordmark(fill, size) = text(font: "Pacifico", size: size, fill: fill)[Growiee]
#let lockup(col, fill, h) = grid(columns: 2, column-gutter: h * 0.24, align: horizon,
  mark(col, h), move(dy: -h * 0.06, wordmark(fill, h * 0.56)))
#let stacked(col, fill, h) = align(center, stack(spacing: h * 0.16, mark(col, h), wordmark(fill, h * 0.5)))

#let panel(fill: soft, height: auto, inset: 7mm, stroke: none, body) = rect(
  width: 100%, height: height, fill: fill, radius: 4mm, inset: inset, stroke: stroke, body)

#let header(num, title, lead) = {
  grid(columns: (52mm, 1fr), column-gutter: 10mm,
    [#caps(num + " — " + title)],
    [])
  v(2mm)
  grid(columns: (1fr, 1fr), column-gutter: 14mm,
    display(lead, size: 26pt),
    [])
  v(7mm)
}

#let section(num, title, sub) = page(fill: indigo, margin: 18mm, footer: none)[
  #place(top + left, caps("Section " + num, fill: pink))
  #place(top + right, mark("silk", 16mm))
  #align(left + bottom)[
    #display(title, size: 54pt, fill: silk) \
    #v(3mm)
    #text(size: 13pt, fill: silk.transparentize(15%), sub)
  ]
]

#let bullet(items, fill: slate) = stack(spacing: 3.2mm, ..items.map(i =>
  grid(columns: (4mm, 1fr), box(circle(radius: 1.2mm, fill: pink), baseline: -0.4mm), text(fill: fill, i))))

// ================================================================= 1 COVER
#page(fill: indigo, margin: 0mm, footer: none)[
  #place(top + left, dx: 18mm, dy: 16mm, caps("Brand guidelines · 2026", fill: pink))
  #place(top + right, dx: -18mm, dy: 16mm, caps("growiee.com", fill: pink))
  #align(center + horizon)[
    #mark("silk", 78mm)
    #v(4mm)
    #wordmark(silk, 58pt)
    #v(2mm)
    #text(font: "Nunito", size: 15pt, fill: silk.transparentize(10%), style: "italic")[Gentle First Steps. Comfort That Grows With Them.]
  ]
  #place(bottom + left, dx: 18mm, dy: -14mm, text(size: 8pt, fill: silk.transparentize(30%))[Premium 100% combed cotton for babies, newborn to 9 months · Sri Lanka])
]

// ================================================================= 2 CONTENTS
#page[
  #grid(columns: (1fr, 1.4fr), column-gutter: 16mm,
    [
      #caps("Contents")
      #v(4mm)
      #display("Everything Growiee looks, sounds and feels like, in one place.", size: 28pt)
      #v(8mm)
      #body-copy(fill: muted)[This book is the single source of truth for the Growiee brand. Use it for every post, package, label, page and product. The design tokens behind it live in #raw("DESIGN.md") and #raw("branding/tokens/").]
    ],
    [
      #set text(size: 11pt)
      #let rows = (
        ("01", "Brand story", "Mission, promise, pillars, audience"),
        ("02", "Brand essence", "The brand world on one board"),
        ("03", "Logo", "Mark, wordmark, lockups"),
        ("04", "Logo rules", "Clear space, sizes, colours, misuse"),
        ("05", "Colour", "Palette, values, pairings, proportions"),
        ("06", "Typography", "Families, scale, hierarchy"),
        ("07", "Mascot", "Groowie, our little friend"),
        ("08", "Imagery", "Photography direction"),
        ("09", "Voice", "How Growiee speaks"),
        ("10", "Product", "The 3-Kit, sizes and claims"),
        ("11", "Digital system", "Components, spacing, accessibility"),
        ("12", "Social media", "Profiles, posts, formats"),
        ("13", "Applications", "Packaging, labels, stationery"),
        ("14", "Commerce", "Price, delivery, payment, channels"),
        ("15", "Files", "Where every asset lives"),
      )
      #for r in rows [
        #grid(columns: (12mm, 46mm, 1fr), align: (left, left, left),
          text(fill: pink.darken(25%), weight: 600, r.at(0)),
          text(font: "Nunito", size: 12.5pt, fill: indigo, weight: 800, r.at(1)),
          text(fill: muted, size: 9.5pt, r.at(2)))
        #v(-1mm)
        #line(length: 100%, stroke: 0.4pt + hair)
        #v(-0.5mm)
      ]
    ])
]

// ================================================================= 01 BRAND STORY
#section("01", "Brand story", "Why Growiee exists and what we promise every family.")

#page[
  #header("01", "Brand story", "Safe, soft, thoughtfully made, from the very first day.")
  #grid(columns: (1fr, 1fr), column-gutter: 14mm,
    [
      #caps("Who we are")
      #v(2mm)
      #body-copy[Growiee is a direct-to-consumer baby apparel brand from Sri Lanka for the first nine months of life. We make ultra-soft, breathable, non-toxic 100% combed cotton sets, sold as coordinated 3-piece packs and delivered islandwide.]
      #v(5mm)
      #caps("Mission")
      #v(2mm)
      #body-copy[To engineer safe, non-toxic, ultra-soft apparel that adapts to an infant's rapid growth during their first 9 months, offering parents absolute peace of mind and accessible luxury.]
      #v(5mm)
      #caps("Audience")
      #v(2mm)
      #body-copy[Expecting and new parents, grandparents and gift-givers who want premium quality without boutique prices. They shop on their phones through Facebook, Instagram and WhatsApp, and value safety above all.]
    ],
    [
      #panel(fill: indigo, inset: 9mm)[
        #caps("Tagline", fill: pink)
        #v(3mm)
        #display("Gentle First Steps. Comfort That Grows With Them.", size: 22pt, fill: silk)
      ]
      #v(5mm)
      #caps("Brand pillars")
      #v(3mm)
      #grid(columns: 3, column-gutter: 4mm,
        ..(("Purity & Safety", "AZO-free dyes and non-toxic materials: zero harsh chemicals on delicate skin."),
           ("Thoughtful Design", "Envelope necks and scratch-free flat seams designed around a baby's daily movement."),
           ("Value & Convenience", "Export-quality cotton in coordinated 3-piece packs, delivered to the doorstep.")).map(p =>
          panel(fill: soft, inset: 5mm, height: 46mm)[
            #text(font: "Nunito", size: 12pt, weight: 800, fill: indigo, p.at(0))
            #v(2mm)
            #text(size: 8.8pt, p.at(1))
          ]))
    ])
]

// ================================================================= 02 BRAND ESSENCE (brandkit board)
#section("02", "Brand essence", "The whole brand world, on one board.")

#page(fill: rgb("#1C1F4A"), margin: 12mm, footer: none)[
  #set text(fill: silk)
  #grid(columns: (1.35fr, 1fr, 1fr), rows: (88mm, 88mm), gutter: 5mm,
    grid.cell(rect(width: 100%, height: 100%, fill: silk, radius: 4mm, inset: 6mm)[
      #caps("Primary logo")
      #align(center + horizon, lockup("indigo", indigo, 24mm))
    ]),
    rect(width: 100%, height: 100%, fill: indigo, radius: 4mm, inset: 6mm)[
      #caps("Mark", fill: pink)
      #align(center + horizon, mark("silk", 42mm))
    ],
    box(width: 100%, height: 100%, radius: 4mm, clip: true, image(P + "baby-portrait.png", width: 100%, height: 100%, fit: "cover")),
    rect(width: 100%, height: 100%, fill: pink, radius: 4mm, inset: 7mm)[
      #caps("Promise", fill: indigo)
      #align(left + bottom, display("Comfort that grows with them.", size: 26pt, fill: indigo))
    ],
    rect(width: 100%, height: 100%, fill: silk, radius: 4mm, inset: 6mm)[
      #caps("Palette")
      #v(4mm)
      #stack(spacing: 2.5mm, ..((indigo, "Royal Indigo"), (violet, "Soft Violet"), (sky, "Bright Sky"), (pink, "Petal Pink"), (silk, "Off-White Silk"), (slate, "Midnight Slate")).map(c =>
        grid(columns: (12mm, 1fr), align: horizon, column-gutter: 3mm,
          rect(width: 12mm, height: 9mm, fill: c.at(0), radius: 2mm, stroke: 0.4pt + hair),
          text(fill: slate, size: 9pt, c.at(1)))))
    ],
    rect(width: 100%, height: 100%, fill: sky, radius: 4mm, inset: 6mm)[
      #caps("Trust", fill: slate)
      #align(center + horizon, stack(spacing: 4mm,
        ..("100% Combed Cotton", "AZO-Free Dyes", "Nickel-Free Snaps").map(b =>
          box(fill: silk, radius: 10mm, inset: (x: 5mm, y: 2.6mm), text(size: 8pt, weight: 600, tracking: 0.14em, fill: slate, upper(b))))))
    ],
  )
]

// ================================================================= 03 LOGO
#section("03", "Logo", "A single flowing line: a little elephant, wrapped in care.")

#page[
  #header("03", "Logo", "One line, drawn without lifting the pen.")
  #grid(columns: (1.3fr, 1fr), column-gutter: 12mm,
    panel(fill: soft, height: 118mm)[
      #caps("Primary lockup")
      #align(center + horizon, lockup("indigo", indigo, 40mm))
    ],
    [
      #caps("The idea")
      #v(2mm)
      #body-copy[The mark is a baby elephant drawn as one continuous monoline: an ear that spirals like a curl of hair, a trunk that curls inward, and a round, protective body. Elephants in Sri Lanka stand for family, memory and gentle strength, exactly what parents want for their child.]
      #v(5mm)
      #caps("Parts")
      #v(2mm)
      #bullet((
        [*Mark:* the line-art elephant. Use alone on small or square spaces (profile pictures, tags, embroidery).],
        [*Wordmark:* "Growiee" in Pacifico, same flat colour as the mark. Capital G only.],
        [*Lockups:* horizontal (default) and stacked. Never re-draw or re-space them.],
      ))
    ])
]

#page[
  #header("03", "Logo", "Lockups and marks for every space.")
  #grid(columns: (1fr, 1fr, 1fr), column-gutter: 6mm, row-gutter: 6mm,
    panel(fill: soft, height: 56mm)[#caps("Horizontal")#align(center + horizon, lockup("indigo", indigo, 20mm))],
    panel(fill: soft, height: 56mm)[#caps("Stacked")#align(center + horizon, stacked("indigo", indigo, 20mm))],
    panel(fill: soft, height: 56mm)[#caps("Mark only")#align(center + horizon, mark("indigo", 30mm))],
    panel(fill: indigo, height: 56mm)[#caps("Reversed", fill: pink)#align(center + horizon, lockup("silk", silk, 20mm))],
    panel(fill: pink, height: 56mm)[#caps("On Petal Pink")#align(center + horizon, stacked("indigo", indigo, 20mm))],
    panel(fill: violet, height: 56mm)[#caps("On Soft Violet", fill: silk)#align(center + horizon, mark("silk", 30mm))],
  )
]

// ================================================================= 04 LOGO RULES
#section("04", "Logo rules", "Clear space, minimum sizes, colour versions and what never to do.")

#page[
  #header("04", "Logo rules", "Give the elephant room to breathe.")
  #let h = 52mm
  #let x = h * 0.25
  #grid(columns: (1.2fr, 1fr), column-gutter: 12mm,
    panel(fill: soft, height: 120mm)[
      #caps("Clear space")
      #let mw = h * 1.188
      #align(center + horizon, box(width: mw + 2 * x, height: h + 2 * x, stroke: (paint: sky, thickness: 0.7pt, dash: "dashed"), {
        place(top + left, dx: x, dy: x, box(stroke: 0.5pt + pink.darken(15%), mark("indigo", h)))
        let lbl = text(size: 9pt, fill: sky, weight: 600)[x]
        place(top + center, dy: x / 2 - 2mm, lbl)
        place(bottom + center, dy: -x / 2 + 2mm, lbl)
        place(left + horizon, dx: x / 2 - 1mm, lbl)
        place(right + horizon, dx: -x / 2 + 1mm, lbl)
      }))
    ],
    [
      #caps("Clear space")
      #v(2mm)
      #body-copy[Keep a clear zone of *x* on every side, where *x* is one quarter of the mark's height. For the lockups, measure x from the mark. Nothing (text, edges, other logos, busy image detail) enters this zone.]
      #v(6mm)
      #caps("Minimum sizes")
      #v(3mm)
      #table(columns: (1fr, 1fr, 1fr), stroke: (x, y) => if y == 0 { (bottom: 0.6pt + indigo) } else { (bottom: 0.4pt + hair) },
        inset: (x: 0mm, y: 2.4mm),
        caps("Asset"), caps("Digital"), caps("Print"),
        [Mark only], [24 px tall], [10 mm tall],
        [Horizontal lockup], [120 px wide], [35 mm wide],
        [Stacked lockup], [72 px tall], [22 mm tall],
        [Embroidery (mark)], [—], [15 mm, one thread],
      )
      #v(4mm)
      #body-copy(fill: muted, size: 9pt)[Below these sizes the ear spiral and trunk curl start to close up. For favicons and app icons, use the mark alone on a Royal Indigo tile.]
    ])
]

#page[
  #header("04", "Logo rules", "Approved colour versions.")
  #let tile(bg, col, fill, name, note) = panel(fill: bg, height: 60mm, inset: 6mm, stroke: if bg == silk { 0.5pt + hair } else { none })[
    #let dark = bg == indigo or bg == slate or bg == violet
    #caps(name, fill: if dark { silk } else { indigo })
    #align(center + horizon, lockup(col, fill, 17mm))
    #place(bottom + left, text(size: 7.5pt, fill: if dark { silk } else { slate }, note))
  ]
  #grid(columns: 3, gutter: 6mm,
    tile(silk, "indigo", indigo, "Primary", "Royal Indigo on Off-White Silk · 10.4:1"),
    tile(indigo, "silk", silk, "Reversed", "Off-White Silk on Royal Indigo · 10.4:1"),
    tile(pink, "indigo", indigo, "Gift", "Royal Indigo on Petal Pink · 4.8:1"),
    tile(silk, "slate", slate, "One colour", "Midnight Slate for single-colour print · 13.4:1"),
    tile(slate, "silk", silk, "Dark", "Off-White Silk on Midnight Slate · 13.4:1"),
    tile(violet, "silk", silk, "Promotional", "Off-White Silk on Soft Violet · 4.8:1"),
  )
]

#page[
  #header("04", "Logo rules", "Never do this.")
  #let bad(caption, body) = stack(spacing: 2.5mm,
    panel(fill: soft, height: 50mm, inset: 4mm)[#align(center + horizon, body)],
    grid(columns: (5mm, 1fr), text(fill: warn, weight: 700)[✕], text(size: 9pt, caption)))
  #grid(columns: 3, gutter: 6mm,
    bad("Don't stretch or squash the logo.", scale(x: 150%, y: 85%, reflow: true, lockup("indigo", indigo, 14mm))),
    bad("Don't rotate or tilt the logo.", rotate(-18deg, reflow: true, lockup("indigo", indigo, 14mm))),
    bad("Don't use low-contrast colours.", lockup("pink", pink, 14mm)),
    bad("Don't add shadows, glows or effects.", box({
      place(dx: 1.6mm, dy: 1.6mm, lockup("pink", pink, 14mm))
      lockup("indigo", indigo, 14mm)
    })),
    bad("Don't place the logo on busy photography.", box(width: 100%, height: 42mm, radius: 3mm, clip: true, {
      image(P + "trio-3kit.png", width: 100%, height: 42mm, fit: "cover")
      place(center + horizon, lockup("indigo", indigo, 12mm))
    })),
    bad("Don't change the wordmark font or write it in capitals.", grid(columns: 2, column-gutter: 3mm, align: horizon,
      mark("indigo", 14mm), text(font: "Google Sans", size: 20pt, weight: 700, fill: indigo, tracking: 0.1em)[GROWIEE])),
  )
]

// ================================================================= 05 COLOUR
#section("05", "Colour", "One deep anchor, two soft accents, airy silk and a gentle ink.")

#page[
  #header("05", "Colour", "Royal Indigo leads; everything else supports it.")
  #let sw(fill, on, name, role, hex, rgbv, cmyk, w: 1fr) = rect(width: 100%, height: 112mm, fill: fill, radius: 4mm, inset: 6mm,
    stroke: if fill == silk { 0.5pt + hair } else { none })[
    #caps(role, fill: on)
    #v(2mm)
    #text(font: "Nunito", size: 15pt, weight: 800, fill: on, name)
    #align(bottom)[
      #set text(size: 8.5pt, fill: on)
      #text(size: 13pt, weight: 600, hex) \
      RGB #rgbv \
      CMYK #cmyk
    ]
  ]
  #grid(columns: (1.4fr, 1fr, 1fr, 1fr, 1fr, 1fr), column-gutter: 3.5mm,
    sw(indigo, silk, "Royal Indigo", "Primary", "#2D348D", "45 52 141", "68 63 0 45"),
    sw(violet, silk, "Soft Violet", "Secondary", "#6C5CE7", "108 92 231", "53 60 0 9"),
    sw(sky, slate, "Bright Sky", "Highlight", "#0FBCF9", "15 188 249", "94 24 0 2"),
    sw(pink, slate, "Petal Pink", "Soft accent", "#F78FB3", "247 143 179", "0 42 28 3"),
    sw(silk, slate, "Off-White Silk", "Background", "#FDFDFD", "253 253 253", "0 0 0 1"),
    sw(slate, silk, "Midnight Slate", "Text", "#222F3E", "34 47 62", "45 24 0 76"),
  )
  #v(3mm)
  #text(size: 8pt, fill: muted)[CMYK values are conversions for reference. Always approve colour on a printed proof, and match fabric dyes to physical Pantone swatches.]
]

#page[
  #header("05", "Colour", "Use it in the right proportion, at the right contrast.")
  #grid(columns: (1fr, 1fr), column-gutter: 14mm,
    [
      #caps("Proportion")
      #v(3mm)
      #box(width: 100%, height: 16mm, radius: 3mm, clip: true, stroke: 0.5pt + hair,
        grid(columns: (52fr, 20fr, 9fr, 8fr, 7fr, 4fr), rows: 16mm,
          rect(width: 100%, height: 100%, fill: silk), rect(width: 100%, height: 100%, fill: indigo),
          rect(width: 100%, height: 100%, fill: violet), rect(width: 100%, height: 100%, fill: sky),
          rect(width: 100%, height: 100%, fill: pink), rect(width: 100%, height: 100%, fill: slate)))
      #v(2mm)
      #grid(columns: (52fr, 20fr, 9fr, 8fr, 7fr, 4fr), text(size: 8pt)[Silk 52%], text(size: 8pt)[Indigo 20%], text(size: 8pt)[Violet], text(size: 8pt)[Sky], text(size: 8pt)[Pink], text(size: 8pt)[])
      #v(7mm)
      #caps("Roles")
      #v(3mm)
      #bullet((
        [*Royal Indigo:* logo, headlines, primary buttons, packaging exteriors.],
        [*Soft Violet:* offers, promotional blocks, secondary buttons, boy/unisex tags.],
        [*Bright Sky:* trust badges, info highlights, WhatsApp buttons. Slate or Indigo text only.],
        [*Petal Pink:* ribbons, gift badges, girl/unisex tags, warm backgrounds. Slate or Indigo text only.],
        [*Off-White Silk:* pages, cards, social canvases, product staging.],
        [*Midnight Slate:* body text, size charts, care labels, dark backgrounds.],
      ))
    ],
    [
      #caps("Accessible pairings (WCAG 2.2)")
      #v(3mm)
      #let pair(bg, fg, label, ratio, verdict) = grid(columns: (22mm, 1fr, 18mm, 22mm), align: horizon, column-gutter: 3mm,
        box(width: 22mm, height: 11mm, fill: bg, radius: 2mm, stroke: 0.4pt + hair, align(center + horizon, text(font: "Nunito", size: 13pt, weight: 800, fill: fg)[Aa])),
        text(size: 9pt, label), text(size: 10pt, weight: 600, ratio), text(size: 8pt, weight: 600, fill: if verdict.starts-with("Never") { warn } else { indigo }, upper(verdict)))
      #stack(spacing: 3mm,
        pair(silk, slate, "Midnight Slate on Silk", "13.4:1", "AAA"),
        pair(silk, indigo, "Royal Indigo on Silk", "10.4:1", "AAA"),
        pair(indigo, silk, "Silk on Royal Indigo", "10.4:1", "AAA"),
        pair(violet, silk, "Silk on Soft Violet", "4.8:1", "AA"),
        pair(sky, slate, "Midnight Slate on Bright Sky", "6.2:1", "AA"),
        pair(pink, slate, "Midnight Slate on Petal Pink", "6.2:1", "AA"),
        pair(pink, indigo, "Royal Indigo on Petal Pink", "4.8:1", "AA"),
        pair(sky, silk, "Silk on Sky or Pink", "2.2:1", "Never for text"),
      )
    ])
]

// ================================================================= 06 TYPOGRAPHY
#section("06", "Typography", "A script for our name, a soft serif for feeling, a clean sans for clarity.")

#page[
  #header("06", "Typography", "Three families, each with one job.")
  #grid(columns: (1fr, 1fr, 1fr), column-gutter: 6mm,
    panel(fill: indigo, height: 118mm)[
      #caps("Wordmark only", fill: pink)
      #v(4mm)
      #text(font: "Pacifico", size: 54pt, fill: silk)[Aa]
      #v(2mm)
      #text(font: "Pacifico", size: 26pt, fill: silk)[Growiee]
      #align(bottom, text(size: 8.5pt, fill: silk)[*Pacifico* · Regular \ Only for the name "Growiee", large, flat, in the logo's colour. Never for sentences.])
    ],
    panel(fill: soft, height: 118mm)[
      #caps("Headlines")
      #v(4mm)
      #text(font: "Nunito", size: 54pt, weight: 800, fill: indigo)[Aa]
      #v(2mm)
      #text(font: "Nunito", size: 14pt, weight: 800, fill: indigo)[ABCDEFGHIJKLM \ abcdefghijklm \ 0123456789]
      #align(bottom, text(size: 8.5pt)[*Nunito* · 700–800 \ Headlines, short emotional lines, product names.])
    ],
    panel(fill: soft, height: 118mm)[
      #caps("Body & UI")
      #v(4mm)
      #text(font: "Google Sans", size: 54pt, weight: 400, fill: slate)[Aa]
      #v(2mm)
      #text(font: "Google Sans", size: 14pt, fill: slate)[ABCDEFGHIJKLM \ abcdefghijklm \ 0123456789]
      #align(bottom, text(size: 8.5pt)[*Google Sans* · 400–700 \ Body copy, prices, buttons, labels, size charts.])
    ])
]

#page[
  #header("06", "Typography", "The type scale.")
  #let row(name, fam, size, weight, lh, sample, extra: (:)) = {
    grid(columns: (34mm, 50mm, 1fr), align: (left + horizon, left + horizon, left + horizon), column-gutter: 4mm,
      caps(name, fill: muted),
      text(size: 8pt, fill: muted)[#fam · #size · #weight · #lh],
      text(font: fam, size: eval(size.replace("px", "pt")) * 0.62, weight: weight, fill: if fam == "Google Sans" { slate } else { indigo }, ..extra, sample))
    v(-1mm); line(length: 100%, stroke: 0.4pt + hair); v(-0.5mm)
  }
  #row("wordmark", "Pacifico", "56px", 400, "1.1", "Growiee")
  #row("headline-display", "Nunito", "48px", 800, "1.1", "Softest first outfits")
  #row("headline-lg", "Nunito", "32px", 800, "1.2", "Made for the first nine months")
  #row("headline-md", "Nunito", "24px", 700, "1.25", "The 0–3M Everyday 3-Kit")
  #row("body-lg", "Google Sans", "18px", 400, "1.6", "Breathable 100% combed cotton that stays soft wash after wash.")
  #row("body-md", "Google Sans", "16px", 400, "1.6", "Envelope necks and flat seams make dressing quick and gentle.")
  #row("body-sm", "Google Sans", "14px", 400, "1.5", "Machine wash cold. Tumble dry low. Do not bleach.")
  #row("label-lg", "Google Sans", "16px", 600, "1.2", "Order on WhatsApp")
  #row("label-caps", "Google Sans", "12px", 600, "1.0", upper("100% Combed Cotton"), extra: (tracking: 0.18em))
  #v(2mm)
  #text(size: 8pt, fill: muted)[Sizes are for screens (px); in print use the same ratios. Body text never below 16 px on mobile, and it must follow the phone's text-size setting.]
]

// ================================================================= 07 MASCOT
#section("07", "Mascot", "Meet Groowie: the friendly face for playful moments.")

#page[
  #header("07", "Mascot", "Groowie, our little friend.")
  #grid(columns: (0.75fr, 1fr, 1.2fr), column-gutter: 8mm,
    box(height: 120mm, radius: 4mm, clip: true, image("/branding/mascot/groowie-turnaround-digital-green.png", height: 120mm, fit: "cover")),
    box(height: 120mm, width: 100%, radius: 4mm, clip: true, image("/branding/mascot/3d/groowie-3d-hero.png", width: 100%, height: 120mm, fit: "cover")),
    [
      #caps("Role")
      #v(2mm)
      #body-copy[Groowie is a gentle little dinosaur who brings joy to social posts, stickers, kids' content and unboxing moments. He is a character, not a logo.]
      #v(5mm)
      #caps("Use Groowie")
      #v(2mm)
      #bullet(([On playful social content, stickers, thank-you cards and packaging inserts.], [In his own colours (sunny yellow with green spikes), on Bright Sky, Indigo or Silk backgrounds.], [With plenty of space around him.]))
      #v(5mm)
      #caps("Never")
      #v(2mm)
      #bullet(([Use Groowie in place of the elephant logo or lock him up with the wordmark.], [Recolour, stretch or redraw him.], [Put him on labels, invoices or formal documents.]))
      #v(4mm)
      #text(size: 8pt, fill: muted)[3D source files: #raw("branding/mascot/3d/")]
    ])
]

// ================================================================= 08 IMAGERY
#section("08", "Imagery", "Soft light, real babies, real cotton.")

#page[
  #header("08", "Imagery", "Calm, natural and close to the fabric.")
  #grid(columns: (1.2fr, 1fr, 1fr), rows: (50mm, 50mm), gutter: 5mm,
    grid.cell(rowspan: 2, box(width: 100%, height: 100%, radius: 4mm, clip: true, image(P + "baby-sitting.png", width: 100%, height: 100%, fit: "cover"))),
    box(width: 100%, height: 100%, radius: 4mm, clip: true, image(P + "baby-portrait.png", width: 100%, height: 100%, fit: "cover")),
    box(width: 100%, height: 100%, radius: 4mm, clip: true, image(P + "stack-folded-3kit.png", width: 100%, height: 100%, fit: "cover")),
    grid.cell(colspan: 2, box(width: 100%, height: 100%, radius: 4mm, clip: true, image(P + "trio-3kit.png", width: 100%, height: 100%, fit: "cover"))),
  )
  #v(4mm)
  #grid(columns: (1fr, 1fr), column-gutter: 14mm,
    bullet(([*Do:* soft natural daylight, pastel garments on white fur, cotton and linen, real babies in calm, cosy moments, close-ups of seams, snaps and fabric.],)),
    bullet(([*Don't:* harsh flash, cluttered rooms, heavy filters, neon colours, posed stock clichés, or text on top of a baby's face.],)))
]

// ================================================================= 09 VOICE
#section("09", "Voice", "How Growiee speaks: like a calm, caring friend who knows cotton.")

#page[
  #header("09", "Voice", "Gentle, reassuring, honest and quietly premium.")
  #grid(columns: (1fr, 1fr, 1fr, 1fr), column-gutter: 4mm,
    ..(("Gentle", "Soft words, short sentences, never shouting. No ALL-CAPS sales copy."),
       ("Reassuring", "Lead with safety: what's in the fabric and what's not."),
       ("Honest", "Real claims only: 100% combed cotton, AZO-free, nickel-free."),
       ("Warm-premium", "Thoughtful and caring, never cutesy or pushy.")).map(t =>
      panel(fill: soft, height: 40mm, inset: 5mm)[
        #text(font: "Nunito", size: 14pt, weight: 800, fill: indigo, t.at(0))
        #v(2mm)
        #text(size: 8.8pt, t.at(1))
      ]))
  #v(6mm)
  #grid(columns: (1fr, 1fr, 1.2fr), column-gutter: 8mm,
    [
      #caps("We say")
      #v(2mm)
      #bullet(([soft, gentle, breathable], [safe for delicate skin], [grows with your baby], [thoughtfully made], [delivered to your door]))
    ],
    [
      #caps("We avoid", fill: warn)
      #v(2mm)
      #bullet(([cheap, bargain, hurry!!!], [chemical-free (say AZO-free)], [organic, unless certified], [baby slang and emoji walls], [fear-based messages]))
    ],
    [
      #caps("Sample lines")
      #v(2mm)
      #panel(fill: pink, inset: 5mm)[
        #set text(size: 9pt)
        #text(font: "Nunito", size: 12pt, fill: indigo)[“Soft from the very first hug.”] \
        #v(1mm)
        *Facebook bio:* Premium combed cotton gentle wear for 0–9M babies. Ultra-soft, non-toxic, and engineered for growth. Delivered islandwide across Sri Lanka. \
        #v(1mm)
        *WhatsApp greeting:* Hi! Thank you for reaching out to Growiee. Which size is your little one: NB, 0–3M, 3–6M or 6–9M?
      ]
    ])
]

// ================================================================= 10 PRODUCT
#section("10", "Product", "The 3-Kit: three coordinated pieces for every stage.")

#page[
  #header("10", "Product", "Every Growiee set is a 3-Kit.")
  #grid(columns: (1.6fr, 1fr), column-gutter: 12mm,
    [
      #table(columns: (22mm, 46mm, 1fr, 16mm), stroke: (x, y) => if y == 0 { (bottom: 0.6pt + indigo) } else { (bottom: 0.4pt + hair) },
        inset: (x: 0mm, y: 3mm), align: horizon,
        caps("Size"), caps("Focus"), caps("In the pack"), caps("Run"),
        text(font: "Nunito", size: 13pt, fill: indigo)[NB], [Delicacy & Easy Access], [3× ultra-soft onesies with scratch-mitt fold-overs], [1],
        text(font: "Nunito", size: 13pt, fill: indigo)[0–3M], [Daily Essentials & Comfort], [3× breathable everyday interlock bodysuits], [3],
        text(font: "Nunito", size: 13pt, fill: indigo)[3–6M], [Active Stretch & Mobility], [3× comfort-fit grow-with-me rompers], [3],
        text(font: "Nunito", size: 13pt, fill: indigo)[6–9M], [Durable Softness], [3× heavy-duty interlock play sets / sleepsuits], [2],
      )
      #v(2mm)
      #text(size: 8pt, fill: muted)[Run = production share (1 : 3 : 3 : 2).]
      #v(6mm)
      #caps("Product claims")
      #v(3mm)
      #stack(spacing: 3mm, dir: ltr,
        ..("100% Combed Cotton", "AZO-Free Dyes", "Nickel-Free Snaps").enumerate().map(((i, b)) =>
          box(fill: if i == 0 { sky } else { soft }, radius: 10mm, inset: (x: 4mm, y: 2.8mm), text(size: 7pt, weight: 600, tracking: 0.12em, fill: slate, upper(b)))))
      #v(3mm)
      #box(fill: soft, radius: 10mm, inset: (x: 4mm, y: 2.8mm), text(size: 7pt, weight: 600, tracking: 0.12em, fill: slate, upper("Envelope Necks & Flat Seams")))
    ],
    box(width: 100%, height: 112mm, radius: 4mm, clip: true, image(P + "stack-folded-3kit.png", width: 100%, height: 112mm, fit: "cover")))
]

// ================================================================= 11 DIGITAL SYSTEM
#section("11", "Digital system", "Components, spacing and accessibility for web, iOS and Android.")

#page[
  #header("11", "Digital system", "Components, built from DESIGN.md tokens.")
  #let btn(bg, fg, label, outline: false) = box(fill: bg, radius: 7mm, height: 12mm, inset: (x: 7mm),
    stroke: if outline { 1.2pt + indigo } else { none }, align(horizon, text(size: 10.5pt, weight: 600, fill: fg, label)))
  #let chip(label, on) = box(fill: if on { indigo } else { soft }, radius: 7mm, height: 11mm, inset: (x: 5mm), align(horizon, text(size: 9.5pt, weight: 600, fill: if on { silk } else { slate }, label)))
  #grid(columns: (1fr, 1fr), column-gutter: 12mm,
    [
      #caps("Buttons · 48 px tall, pill")
      #v(3mm)
      #stack(dir: ltr, spacing: 4mm, btn(indigo, silk, "Add 3-Kit to cart"), btn(violet, silk, "Size guide"))
      #v(3mm)
      #btn(sky, slate, "Order on WhatsApp")
      #v(7mm)
      #caps("Size chips · selected = Royal Indigo")
      #v(3mm)
      #stack(dir: ltr, spacing: 3mm, chip("NB", false), chip("0–3M", true), chip("3–6M", false), chip("6–9M", false))
      #v(7mm)
      #caps("Badges")
      #v(3mm)
      #stack(dir: ltr, spacing: 3mm,
        box(fill: sky, radius: 7mm, inset: (x: 4mm, y: 2.6mm), text(size: 7pt, weight: 600, tracking: 0.16em, fill: slate)[100% COMBED COTTON]),
        box(fill: pink, radius: 7mm, inset: (x: 4mm, y: 2.6mm), text(size: 7pt, weight: 600, tracking: 0.16em, fill: slate)[GIFT READY]))
      #v(7mm)
      #caps("Input · 12 px radius")
      #v(3mm)
      #box(width: 90mm, height: 12mm, radius: 3mm, stroke: 0.8pt + rgb("#D4D4D4"), inset: (x: 4mm), align(horizon, text(size: 10pt, fill: muted)[Delivery address]))
    ],
    panel(fill: soft, height: 118mm, inset: 6mm)[
      #caps("Product card")
      #v(3mm)
      #box(width: 100%, fill: silk, radius: 5mm, inset: 4mm, stroke: 0.5pt + hair)[
        #box(width: 100%, height: 58mm, radius: 4mm, clip: true, image(P + "trio-3kit.png", width: 100%, height: 58mm, fit: "cover"))
        #v(2mm)
        #text(font: "Nunito", size: 14pt, weight: 800, fill: indigo)[Everyday Bodysuit 3-Kit] \
        #text(size: 9pt, fill: muted)[0–3 months · 100% combed cotton] \
        #v(1mm)
        #grid(columns: (1fr, auto), align: horizon, text(size: 13pt, weight: 600)[LKR 4,850], box(fill: indigo, radius: 6mm, inset: (x: 4mm, y: 2.4mm), text(size: 8.5pt, weight: 600, fill: silk)[Add to cart]))
      ]
    ])
]

#page[
  #header("11", "Digital system", "Spacing, shape and platform rules.")
  #grid(columns: (1fr, 1fr, 1.25fr), column-gutter: 8mm,
    [
      #caps("Spacing · 4 px base, 8 px rhythm")
      #v(3mm)
      #stack(spacing: 2.4mm, ..(("xs", 4), ("sm", 8), ("md", 16), ("lg", 24), ("xl", 32), ("2xl", 48), ("3xl", 64)).map(s =>
        grid(columns: (12mm, 1fr), align: horizon, text(size: 8.5pt, weight: 600, s.at(0)),
          grid(columns: 2, column-gutter: 2mm, align: horizon, rect(width: s.at(1) * 0.55mm, height: 4mm, fill: pink, radius: 1mm), text(size: 8pt, fill: muted, str(s.at(1)) + " px")))))
      #v(6mm)
      #caps("Corner radius")
      #v(3mm)
      #stack(dir: ltr, spacing: 3mm, ..(("sm", 2mm, "8"), ("md", 3mm, "12"), ("lg", 5mm, "20"), ("pill", 6mm, "full")).map(r =>
        stack(spacing: 1.5mm, rect(width: 15mm, height: 12mm, radius: r.at(1), fill: indigo), text(size: 7.5pt, fill: muted, r.at(0) + " · " + r.at(2)))))
    ],
    [
      #caps("Layout grid")
      #v(3mm)
      #bullet((
        [*Phone:* 4 columns, 16 px margins, 16 px gutters.],
        [*Tablet:* 8 columns, 24 px margins.],
        [*Desktop:* 12 columns, max 1200 px, 32 px margins.],
        [*Elevation:* tonal layers first; one soft shadow at most (0 8 24, 8% ink).],
        [*Motion:* soft 200–300 ms ease-out; honour reduced motion.],
      ))
    ],
    [
      #caps("Platform & accessibility rules")
      #v(3mm)
      #bullet((
        [*Touch targets* at least 48 × 48 px (Material 48 dp, Apple 44 pt; WCAG 2.2 minimum 24 px), 8 px apart.],
        [*Contrast:* 4.5:1 for body text, 3:1 for large text, icons and input borders (WCAG 2.2 AA).],
        [*Text size* follows iOS Dynamic Type and Android font scale; layouts reflow at 200%.],
        [*Safe areas:* never put actions under the notch, home indicator or system bars.],
        [*Focus:* visible 2 px Royal Indigo ring with 2 px offset on every interactive element.],
        [*Native patterns:* iOS uses bottom tab bars and sheets; Android uses Material 3 navigation bar and back gesture; web keeps standard links and forms.],
        [*Never rely on colour alone*: pair colour with text or icons (e.g., selected size chip also shows a check).],
      ))
    ])
]

// ================================================================= 12 SOCIAL
#section("12", "Social media", "Where most families first meet Growiee.")

#page[
  #header("12", "Social media", "Profiles and post layouts.")
  #grid(columns: (0.8fr, 1.9fr), column-gutter: 8mm,
    [
      #caps("Profile picture")
      #v(3mm)
      #align(center, circle(radius: 26mm, fill: indigo, align(center + horizon, mark("silk", 26mm))))
      #v(3mm)
      #text(size: 8.5pt)[Mark only, Off-White Silk on Royal Indigo, centred with generous space. Export 2048 × 2048 px.]
      #v(6mm)
      #caps("Facebook page")
      #v(2mm)
      #text(size: 8.5pt)[*Name:* Growiee \ *Category:* Shopping & Retail / Baby & Children's Clothing Store \ *Button:* Send WhatsApp Message]
    ],
    [
      #caps("Cover · 1640 × 624")
      #v(2mm)
      #box(width: 100%, height: 44mm, radius: 3mm, clip: true, fill: indigo, {
        place(right + horizon, box(width: 46%, height: 44mm, clip: true, image(P + "trio-3kit.png", width: 100%, height: 44mm, fit: "cover")))
        place(left + horizon, dx: 9mm, stack(spacing: 2mm, lockup("silk", silk, 13mm), text(font: "Nunito", size: 11pt, fill: silk)[Comfort that grows with them.]))
      })
      #v(5mm)
      #caps("Post · 1080 × 1350 (4:5)")
      #v(2mm)
      #grid(columns: 3, column-gutter: 4mm,
        box(width: 100%, height: 66mm, radius: 3mm, clip: true, {
          image(P + "baby-portrait.png", width: 100%, height: 66mm, fit: "cover")
          place(bottom + left, box(width: 100%, fill: indigo, inset: 3mm, stack(spacing: 1.5mm, text(font: "Nunito", size: 10pt, fill: silk)[Soft from the first hug], text(size: 6.5pt, fill: pink, tracking: 0.14em)[NEWBORN 3-KIT · LKR 4,850])))
          place(top + right, dx: -2.5mm, dy: 2.5mm, mark("indigo", 7mm))
        }),
        box(width: 100%, height: 66mm, radius: 3mm, fill: pink, inset: 4mm)[
          #mark("indigo", 8mm)
          #align(horizon, display("Gift-ready, delivered islandwide.", size: 14pt))
          #place(bottom + left, box(fill: indigo, radius: 5mm, inset: (x: 3mm, y: 1.8mm), text(size: 6.5pt, weight: 600, fill: silk)[ORDER ON WHATSAPP]))
        ],
        box(width: 100%, height: 66mm, radius: 3mm, fill: silk, stroke: 0.5pt + hair, inset: 4mm)[
          #caps("Why parents trust us", size: 6pt)
          #v(2mm)
          #stack(spacing: 2mm, ..("100% Combed Cotton", "AZO-Free Dyes", "Nickel-Free Snaps", "Flat Seams").map(b => box(fill: if b.starts-with("100") { sky } else { soft }, radius: 5mm, inset: (x: 2.6mm, y: 1.6mm), text(size: 6pt, weight: 600, tracking: 0.1em, upper(b)))))
          #place(bottom + left, lockup("indigo", indigo, 6mm))
        ],
      )
      #v(2mm)
      #text(size: 8pt, fill: muted)[Keep the logo and all text in the central 80%. One message per post. Prices always in LKR.]
    ])
]

// ================================================================= 13 APPLICATIONS
#section("13", "Applications", "Packaging, labels and stationery.")

#page[
  #header("13", "Applications", "The brand in hand.")
  #grid(columns: (1.3fr, 0.7fr, 1fr), column-gutter: 7mm,
    panel(fill: soft, height: 112mm)[
      #caps("3-Kit gift box")
      #align(center + horizon, box(width: 92mm, height: 62mm, {
        rect(width: 92mm, height: 62mm, fill: indigo, radius: 2mm)
        place(top + left, dx: 0mm, dy: 25mm, rect(width: 92mm, height: 6mm, fill: pink))
        place(top + left, dx: 58mm, dy: 0mm, rect(width: 6mm, height: 62mm, fill: pink))
        place(top + left, dx: 12mm, dy: 9mm, mark("silk", 13mm))
        place(bottom + left, dx: 10mm, dy: -8mm, wordmark(silk, 18pt))
      }))
    ],
    panel(fill: soft, height: 112mm)[
      #caps("Hang tag")
      #align(center + horizon, box(width: 34mm, height: 68mm, {
        rect(width: 34mm, height: 68mm, fill: indigo, radius: 3mm)
        place(top + center, dy: 4mm, circle(radius: 2mm, fill: silk))
        place(top + center, dy: 14mm, mark("silk", 15mm))
        place(top + center, dy: 36mm, wordmark(silk, 13pt))
        place(bottom + center, dy: -6mm, text(size: 6pt, fill: pink, tracking: 0.14em)[0–3M · 3-KIT])
      }))
    ],
    stack(spacing: 6mm,
      panel(fill: soft, height: 50mm)[
        #caps("Woven neck label")
        #align(center + horizon, box(width: 56mm, height: 18mm, fill: indigo, radius: 1.5mm, align(center + horizon, lockup("silk", silk, 8mm))))
      ],
      panel(fill: soft, height: 56mm)[
        #caps("Business card")
        #align(center + horizon, grid(columns: 2, column-gutter: 4mm,
          box(width: 40mm, height: 25mm, fill: indigo, radius: 1.5mm, align(center + horizon, mark("silk", 12mm))),
          box(width: 40mm, height: 25mm, fill: silk, radius: 1.5mm, stroke: 0.5pt + hair, inset: 3mm)[
            #lockup("indigo", indigo, 5mm)
            #v(1mm)
            #text(size: 5pt)[hello\@growiee.com · growiee.com \ Colombo, Sri Lanka]
          ]))
      ]),
  )
]

// ================================================================= 14 COMMERCE
#section("14", "Commerce", "How families find, order and receive Growiee.")

#page[
  #header("14", "Commerce", "Simple, safe, islandwide.")
  #grid(columns: (1fr, 1fr, 1fr), column-gutter: 6mm,
    panel(fill: indigo, height: 64mm)[
      #caps("Price · 3-Kit", fill: pink)
      #v(4mm)
      #text(font: "Nunito", size: 22pt, fill: silk)[LKR 4,850 – 5,200]
      #v(2mm)
      #text(size: 9pt, fill: silk)[Premium export-quality cotton at an accessible price.]
    ],
    panel(fill: soft, height: 64mm)[
      #caps("Delivery")
      #v(4mm)
      #text(font: "Nunito", size: 20pt, fill: indigo)[All 25 districts]
      #v(2mm)
      #text(size: 9pt)[Flat fee LKR 450–550, waived on multi-pack free-shipping tiers. \ Couriers: Koombiyo Delivery, Domex Courier, Pronto Lanka.]
    ],
    panel(fill: soft, height: 64mm)[
      #caps("Payment")
      #v(4mm)
      #text(font: "Nunito", size: 20pt, fill: indigo)[Cash on Delivery]
      #v(2mm)
      #text(size: 9pt)[Primary payment method. Card checkout on growiee.com.]
    ],
  )
  #v(6mm)
  #caps("Channels")
  #v(3mm)
  #grid(columns: 3, column-gutter: 6mm,
    ..(("Facebook & Instagram", "Discovery, posts and ads; every post points to WhatsApp or the website."),
       ("WhatsApp Business", "Real-time sales support and orders; reply with sizes NB, 0–3M, 3–6M, 6–9M."),
       ("growiee.com", "Full catalogue, card checkout and size guide.")).map(c =>
      grid(columns: (3mm, 1fr), column-gutter: 4mm, rect(width: 3mm, height: 22mm, fill: pink, radius: 1mm),
        [#text(font: "Nunito", size: 13pt, fill: indigo, c.at(0)) \ #text(size: 9pt, c.at(1))])))
]

// ================================================================= 15 FILES
#section("15", "Files", "Where every brand asset lives.")

#page[
  #header("15", "Files", "One source of truth.")
  #table(columns: (70mm, 1fr), stroke: (x, y) => if y == 0 { (bottom: 0.6pt + indigo) } else { (bottom: 0.4pt + hair) },
    inset: (x: 0mm, y: 3.2mm),
    caps("Asset"), caps("Location"),
    [Logo (Illustrator, SVG, PNG)], raw("branding/logos/growiee-logo.ai · .svg · .png"),
    [Logo artwork for layouts], raw("branding/brand-guidelines/assets/mark-*.svg"),
    [Previous logo (archived)], raw("branding/logos/old-logo/"),
    [Design system], raw("DESIGN.md"),
    [Design tokens (CSS, W3C)], raw("branding/tokens/growiee.tokens.css · design.tokens.json"),
    [Brand, product, commerce, colour tokens], raw("branding/tokens/*.tokens.json"),
    [Mascot Groowie (2D, 3D)], raw("branding/mascot/"),
    [Fonts (OFL): Pacifico, Nunito, Google Sans], raw("branding/brand-guidelines/fonts/"),
    [This guide (Typst source + PDF)], raw("branding/brand-guidelines/"),
    [Social posts and marketing], raw("marketing/"),
  )
]

// ================================================================= BACK COVER
#page(fill: indigo, margin: 0mm, footer: none)[
  #align(center + horizon)[
    #mark("silk", 46mm)
    #v(3mm)
    #wordmark(silk, 34pt)
    #v(4mm)
    #text(size: 9pt, fill: pink, tracking: 0.18em)[GROWIEE.COM · SRI LANKA]
  ]
]
