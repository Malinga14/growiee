// Growiee courier mailer v2: print specification
// Build from the repo root:
//   typst compile --root . --font-path branding/brand-guidelines/fonts \
//     marketing/remotion/packaging/courier-bag/growiee-courier-bag-v2-print-spec.typ \
//     marketing/remotion/packaging/courier-bag/growiee-courier-bag-v2-print-spec.pdf

// ---------------------------------------------------------------- tokens
#let indigo = rgb("#2D348D")
#let pink = rgb("#F78FB3")
#let silk = rgb("#FDFDFD")
#let slate = rgb("#222F3E")
#let muted = rgb("#576574")
#let hair = rgb("#E5E5E5")
#let soft = rgb("#F5F5F5")
#let milk = rgb("#F7F5F0")
#let milk-flap = rgb("#EEEAE1")
#let purple = rgb("#9459DA")
#let purple-flap = rgb("#8A4FD1")
#let good = rgb("#1E7A4C")
#let warn = rgb("#B42318")

#let A = "/branding/brand-guidelines/assets/"
#let ART = "/marketing/remotion/packaging/courier-bag/growiee-courier-bag-v2-front-print-12x16in.svg"
#let ART-PURPLE = "/marketing/remotion/packaging/courier-bag/growiee-courier-bag-v2-purple-front-print-12x16in.svg"

// ---------------------------------------------------------------- page + type
#set document(title: "Growiee Courier Mailer v2 · Print Specification", author: "Growiee")
#set text(font: "Google Sans", size: 10pt, fill: slate, weight: 400)
#set par(leading: 0.7em, justify: false)
#set page(
  paper: "a4", flipped: true, fill: silk,
  margin: (x: 18mm, top: 16mm, bottom: 18mm),
  footer: context {
    set text(size: 7pt, fill: muted, tracking: 0.12em)
    grid(columns: (1fr, auto), upper[Growiee · Courier mailer v2 · Print specification],
      str(counter(page).get().first()))
  },
)

#let mark(col, h) = image(A + "mark-" + col + ".svg", height: h)
#let wordmark(fill, size) = text(font: "Pacifico", size: size, fill: fill)[Growiee]
#let caps(body, fill: indigo, size: 7.5pt) = text(size: size, weight: 600, tracking: 0.18em, fill: fill, upper(body))
#let display(body, size: 24pt, fill: indigo, weight: 300) = text(font: "Nunito", size: size, weight: weight, fill: fill, body)
#let muted-copy(body, size: 9pt) = text(size: size, fill: muted, body)

#let header(num, title, lead) = {
  caps(num + " — " + title)
  v(3mm)
  display(lead, size: 26pt)
  v(8mm)
}

// A label/value row with a hairline under it.
#let rows(label: 46mm, ..pairs) = table(
  columns: (label, 1fr),
  stroke: (x, y) => (bottom: 0.4pt + hair),
  inset: (x: 0mm, y: 3.4mm),
  ..pairs.pos().map(((k, v)) => (caps(k, fill: muted, size: 7pt), v)).flatten(),
)

#let tick(ok) = if ok { text(fill: good, weight: 600)[✓] } else { text(fill: warn, weight: 600)[✗] }

// ---------------------------------------------------------------- bag drawing
// Face 12 x 16 in, flap 2 in. Drawn at `s` of real size.
#let FW = 304.8mm
#let FH = 406.4mm
#let FL = 50.8mm

#let dim-h(w, label) = box(width: w, height: 6mm, {
  place(top + left, dy: 1.5mm, line(length: w, stroke: 0.5pt + muted))
  place(top + left, line(start: (0mm, 0mm), end: (0mm, 3mm), stroke: 0.5pt + muted))
  place(top + right, line(start: (0mm, 0mm), end: (0mm, 3mm), stroke: 0.5pt + muted))
  place(top + center, dy: 3mm, text(size: 7pt, fill: muted, label))
})

#let dim-v(h, label) = box(width: 18mm, height: h, {
  place(top + left, dx: 1.5mm, line(angle: 90deg, length: h, stroke: 0.5pt + muted))
  place(top + left, line(length: 3mm, stroke: 0.5pt + muted))
  place(bottom + left, line(length: 3mm, stroke: 0.5pt + muted))
  place(left + horizon, dx: 4.5mm, text(size: 7pt, fill: muted, label))
})

// Flat bag seen from the front, flap open above the opening.
#let bag-open(s) = {
  let w = FW * s
  let f = FL * s
  let h = FH * s
  grid(columns: (w, 18mm), column-gutter: 2mm, row-gutter: 1mm,
    box(width: w, height: f + h, {
      place(top + left, rect(width: w, height: f + 1mm, fill: milk-flap, radius: (top: 1.4mm)))
      place(top + left, dx: 3mm, dy: f * 0.45, rect(width: w - 6mm, height: 1.6mm, fill: pink.lighten(55%), radius: 0.8mm))
      place(top + left, dy: f, rect(width: w, height: h, fill: milk, stroke: 0.4pt + hair))
      place(top + left, dy: f, image(ART, width: w))
      place(top + left, dy: f, line(length: w, stroke: (paint: muted, thickness: 0.5pt, dash: "dashed")))
    }),
    stack(dim-v(f, [2 in flap]), dim-v(h, [16 in \ 406 mm])),
    dim-h(w, [12 in · 305 mm]),
    [],
  )
}

// Same bag, sealed: the flap folded down over the top 2 in of the front.
#let bag-sealed(s, art: ART, film: milk, flap: milk-flap, seam: rgb("#D9D4C8")) = {
  let w = FW * s
  let f = FL * s
  let h = FH * s
  box(width: w, height: h, {
    place(top + left, rect(width: w, height: h, fill: film, stroke: 0.4pt + hair, radius: 1mm))
    place(top + left, image(art, width: w))
    place(top + left, rect(width: w, height: f, fill: flap, radius: (top: 1mm)))
    place(top + left, dy: f, line(length: w, stroke: 0.6pt + seam))
  })
}

// ================================================================= 1 COVER
#page(fill: indigo, margin: 0mm, footer: none)[
  #place(top + left, dx: 18mm, dy: 16mm, caps("Packaging · Print specification", fill: pink))
  #place(top + right, dx: -18mm, dy: 16mm, caps("Courier mailer · v2", fill: pink))
  #place(left + horizon, dx: 18mm)[
    #display("Courier mailer", size: 50pt, fill: silk) \
    #v(2mm)
    #text(size: 13pt, fill: silk.transparentize(15%))[Milk white or purple · 12 × 16 in · front print · one colour]
  ]
  #place(right + horizon, dx: -30mm, align(center)[
    #mark("silk", 62mm)
    #v(4mm)
    #wordmark(silk, 40pt)
  ])
  #place(bottom + left, dx: 18mm, dy: -14mm, text(size: 8pt, fill: silk.transparentize(30%))[Everything the bag supplier needs to quote, print and proof the Growiee courier bag · October 2026])
]

// ================================================================= 2 ORDER
#page[
  #header("01", "The order", "Six answers for the supplier.")
  #grid(columns: (1.35fr, 1fr), column-gutter: 16mm,
    rows(
      ("Bag quantity", text(size: 12pt)[*100 pcs* · the minimum order]),
      ("Bag colour", text(size: 12pt)[*Milk white*]),
      ("Bag size", text(size: 12pt)[*12 × (16 + 2″ flap) × 220G* \ #muted-copy[305 × 406 mm face, 51 mm flap, 220 gauge film]]),
      ("Printing colours", text(size: 12pt)[*1 colour · Royal Indigo* \ #muted-copy[#raw("#2D348D") · CMYK 68 63 0 45 · match on a printed proof]]),
      ("Printing side", text(size: 12pt)[*Single side · front only* \ #muted-copy[The back stays plain for the courier waybill.]]),
      ("Logo & design", text(size: 12pt)[*Growiee stacked logo, centred* \ #muted-copy[Elephant mark over the wordmark, GROWIEE.COM small at the foot. Artwork file: page 06.]]),
    ),
    [
      #rect(width: 100%, fill: soft, radius: 4mm, inset: 7mm)[
        #caps("Why 12 × 16 in")
        #v(3mm)
        #text(size: 10pt)[Holds *two folded 3-Kit packs* with room to spare (three at a squeeze) and a single gift box. 10 × 14 in only takes one pack; 14 × 18 in is for three packs or two boxes.]
        #v(4mm)
        #caps("Why one colour, one side")
        #v(3mm)
        #text(size: 10pt)[The logo alone on milk white is the calmest, most premium look, and one screen on one side keeps the 100-piece run at the lowest cost.]
      ]
    ],
  )
]

// ================================================================= 3 DESIGN
#page[
  #header("02", "The design", "Just the elephant, centred.")
  #grid(columns: (auto, auto, 1fr), column-gutter: 10mm,
    [
      #caps("Flat · flap open", fill: muted, size: 7pt)
      #v(3mm)
      #bag-open(0.25)
    ],
    [
      #caps("Sealed · as delivered", fill: muted, size: 7pt)
      #v(3mm)
      #v(50.8mm * 0.25)
      #bag-sealed(0.25)
    ],
    [
      #caps("Artwork placement")
      #v(2mm)
      #set text(size: 9pt)
      #rows(label: 21mm,
        ("Logo", [Stacked lockup, centred on the bag's vertical centre line (152.4 mm from each side)]),
        ("Mark", [109.3 × 92.0 mm. Top edge 143.9 mm below the top of the face]),
        ("Wordmark", [“Growiee” in Pacifico, 159.4 mm wide, 10 mm below the feet. Never in capitals]),
        ("URL", [GROWIEE.COM, Google Sans 600, 4.2 mm, tracked. Baseline ≈ 21 mm above the bottom edge]),
        ("Flap zone", [Top 2 in of the front is covered once sealed. Nothing is printed there]),
        ("Margins", [All artwork ≥ 15 mm from every edge and seal]),
      )
    ],
  )
]

// ================================================================= 4 PURPLE
#page[
  #header("03", "Purple bag option", "Same elephant, in white.")
  #grid(columns: (auto, 1fr), column-gutter: 16mm,
    [
      #caps("Sealed · as delivered", fill: muted, size: 7pt)
      #v(3mm)
      #bag-sealed(0.265, art: ART-PURPLE, film: purple, flap: purple-flap, seam: purple-flap.darken(12%))
    ],
    [
      #rows(
        ("Bag quantity", text(size: 12pt)[*100 pcs*]),
        ("Bag colour", text(size: 12pt)[*Purple* \ #muted-copy[WoMart stock purple courier bag. Photo colour ≈ #raw("#9459DA")]]),
        ("Bag size", text(size: 12pt)[*12 × (16 + 2″ flap)* \ #muted-copy[30 × 40 + 5 cm · WoMart list price Rs. 32.00 unprinted]]),
        ("Printing colours", text(size: 12pt)[*1 colour · white* \ #muted-copy[Off-White Silk #raw("#FDFDFD"). Opaque white, double hit so the purple does not show through]]),
        ("Printing side", text(size: 12pt)[*Single side · front only*]),
        ("Logo & design", text(size: 12pt)[*Same artwork as the milk bag, in white* \ #muted-copy[Same size and placement as page 03. File: page 06]]),
      )
      #v(5mm)
      #rect(width: 100%, fill: soft, radius: 4mm, inset: 6mm)[
        #caps("Why white, not indigo")
        #v(2.5mm)
        #text(size: 9.5pt)[Royal Indigo on purple would almost vanish. White on the purple film reads clearly (about 4.4 : 1) and is the guide's approved reversed logo on violet. The bag purple is warmer than Soft Violet #raw("#6C5CE7"): fine for packaging, but it is not a new brand colour.]
      ]
    ],
  )
]

// ================================================================= 5 SIZES
#page[
  #header("04", "Size and capacity", "How many packs each bag holds.")
  #grid(columns: (1.25fr, 1fr), column-gutter: 14mm,
    [
      #caps("Supplier sizes", fill: muted, size: 7pt)
      #v(2mm)
      #table(
        columns: (auto, auto, 1fr, auto),
        stroke: (x, y) => if y == 0 { (bottom: 0.6pt + indigo) } else { (bottom: 0.4pt + hair) },
        inset: (x: 2.2mm, y: 2.8mm),
        fill: (x, y) => if y == 4 { pink.lighten(80%) } else { none },
        caps("Size (in)", size: 6.5pt), caps("Face (mm)", size: 6.5pt), caps("Holds", size: 6.5pt), caps("Use", size: 6.5pt),
        [7 × 10], [178 × 254], [Accessories, a single small item], muted-copy[—],
        [8 × 12], [203 × 305], [Too narrow for a folded pack], muted-copy[—],
        [10 × 14], [254 × 356], [1 folded pack], muted-copy[Single orders],
        [*12 × 16*], [*305 × 406*], [*2 folded packs* (3 at a squeeze), 1 gift box], text(fill: indigo, weight: 600)[Chosen],
        [14 × 18], [356 × 457], [3+ packs, 2 gift boxes], muted-copy[Big orders],
      )
      #v(2mm)
      #muted-copy[All sizes have a 2 in flap on top of the length and 220 gauge film (about 56 µm). Face = the flat bag below the flap.]
    ],
    [
      #caps("Will it fit?", fill: muted, size: 7pt)
      #v(2mm)
      #rect(width: 100%, fill: soft, radius: 4mm, inset: 6mm)[
        #text(size: 9.5pt)[A flat bag wraps round the thickness of what goes in. Both must be true:]
        #v(3mm)
        #text(size: 10.5pt, fill: indigo)[pack width + stack thickness ≤ bag width \ pack length + stack thickness ≤ bag length]
      ]
      #v(4mm)
      #caps("12 × 16 in check (305 × 406 mm)", fill: muted, size: 7pt)
      #v(1mm)
      #table(
        columns: (1fr, auto, auto, auto),
        stroke: (x, y) => if y == 0 { (bottom: 0.6pt + indigo) } else { (bottom: 0.4pt + hair) },
        inset: (x: 1.6mm, y: 2.6mm),
        caps("Contents", size: 6.5pt), caps("Width", size: 6.5pt), caps("Length", size: 6.5pt), caps("Fits", size: 6.5pt),
        [2 folded packs, 6 cm], [26 ≤ 30.5], [31 ≤ 40.6], tick(true),
        [3 folded packs, 9 cm], [29 ≤ 30.5], [34 ≤ 40.6], tick(true),
        [1 gift box, 7 cm], [25 ≤ 30.5], [32 ≤ 40.6], tick(true),
        [2 gift boxes, 14 cm], [32 > 30.5], [—], tick(false),
      )
      #v(2mm)
      #muted-copy(size: 8pt)[Estimates in cm, from a folded 3-Kit pack of about 20 × 25 × 3 cm and a gift box of about 25 × 18 × 7 cm. Measure the real pack and box before ordering.]
    ],
  )
]

// ================================================================= 5 PRINT
#page[
  #header("05", "Print, files and proof", "One ink, done right.")
  #grid(columns: (0.8fr, 1fr, 1fr), column-gutter: 12mm,
    [
      #rect(width: 100%, height: 44mm, fill: indigo, radius: 4mm, inset: 6mm)[
        #caps("Ink · milk bag", fill: pink)
        #v(2mm)
        #text(font: "Nunito", size: 15pt, weight: 800, fill: silk)[Royal Indigo]
        #align(bottom)[
          #set text(size: 8.5pt, fill: silk)
          #text(size: 12pt, weight: 600)[\#2D348D] \
          CMYK 68 63 0 45
        ]
      ]
      #v(3mm)
      #rect(width: 100%, height: 36mm, fill: purple, radius: 4mm, inset: 6mm)[
        #caps("Ink · purple bag", fill: silk)
        #v(2mm)
        #text(font: "Nunito", size: 15pt, weight: 800, fill: silk)[Opaque white]
        #align(bottom, text(size: 8.5pt, fill: silk)[\#FDFDFD · double hit])
      ]
      #v(3mm)
      #muted-copy(size: 8pt)[CMYK is a conversion for reference. Approve each ink on a printed proof on the actual bag film.]
    ],
    [
      #caps("Print rules")
      #v(2mm)
      #rows(label: 26mm,
        ("Ink", [One solid ink: Royal Indigo on milk, opaque white on purple. No tints, screens or gradients]),
        ("Logo", [Never stretched, rotated, outlined or recoloured]),
        ("Mark lines", [Drawn as strokes. If asked, outline them without changing the line weight]),
        ("Text", [Already converted to outlines. No fonts needed]),
        ("Back", [Unprinted]),
      )
    ],
    [
      #caps("Files")
      #v(2mm)
      #let file(name, note) = [#text(size: 8pt, weight: 600)[#name] \ #muted-copy(size: 8pt, note)]
      #rows(label: 24mm,
        ("Milk bag", file("growiee-courier-bag-v2-front-print-12x16in.svg", [Send this · vector, real size in mm · Royal Indigo])),
        ("Purple bag", file("growiee-courier-bag-v2-purple-front-print-12x16in.svg", [Send this · vector, white ink · its purple layer is marked NON-PRINTING])),
        ("Reference", [#text(size: 8pt)[300 dpi PNGs (3600 × 4800 px) and preview boards for both bags, same names with #raw("-300dpi.png") / #raw("-board")]]),
      )
      #v(5mm)
      #caps("Before approving the proof")
      #v(3mm)
      #let check(t) = grid(columns: (5mm, 1fr), box(rect(width: 3mm, height: 3mm, stroke: 0.6pt + indigo, radius: 0.6mm), baseline: -0.2mm), t)
      #stack(spacing: 2.6mm,
        check[Milk bag: indigo matches the swatch, not navy or purple],
        check[Purple bag: white is solid, no purple showing through],
        check[Logo is centred, sharp, ear spiral and trunk curl open],
        check[Nothing printed under the 2 in flap],
        check[“Growiee” spelled right, never in capitals],
        check[Folded packs fit before the full run of 100],
      )
    ],
  )
]

// ================================================================= BACK
#page(fill: indigo, margin: 0mm, footer: none)[
  #align(center + horizon)[
    #mark("silk", 40mm)
    #v(3mm)
    #wordmark(silk, 30pt)
    #v(4mm)
    #text(size: 9pt, fill: pink, tracking: 0.18em)[GROWIEE.COM · SRI LANKA]
  ]
]
