#import "style.typ": *

#set page(width: 612.00pt, height: 792.00pt, margin: 0pt)
#set text(size: 10pt)

#textbox(x: 20.4em, y: 26.67em, w: 21.75em, h: 16.92em)[
  #import "@preview/cetz:0.3.4"
  #cetz.canvas(length: 2.416em, {
    import cetz.draw: *
    let annotate-color = rgb("#0066CC")

    // piece 1: y = 2x on [0, 2]
    let pts1 = range(0, 21).map(i => {
      let x = i * 2.0 / 20
      (x + 1, 2 * x + 1)
    })
    line(..pts1, stroke: 0.8pt + annotate-color)

    // piece 2: y = -0.5x²+2x+2 on [2, 4]
    let pts2 = range(0, 21).map(i => {
      let x = 2 + i * 2.0 / 20
      (x + 1, -0.5 * x * x + 2 * x + 2 + 1)
    })
    line(..pts2, stroke: 0.8pt + annotate-color)

    // piece 3: y = 0.5x²-4x+10 on [4, 6]
    let pts3 = range(0, 21).map(i => {
      let x = 4 + i * 2.0 / 20
      (x + 1, 0.5 * x * x - 4 * x + 10 + 1)
    })
    line(..pts3, stroke: 0.8pt + annotate-color)
  })
]

#textbox(x: 13em, y: 58em, w: 36em, h: 10em)[
  $
  G'(x) = sqrt(1 + x^4) dot frac(dif, dif x)(x)
  = #box(stroke: 0.5pt + rgb("#0066CC"), inset: 3pt, $sqrt(1 + x^4)$)
  $
]
