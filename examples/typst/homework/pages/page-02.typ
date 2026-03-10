#import "style.typ": *

#set page(width: 612.00pt, height: 792.00pt, margin: 0pt)
#set text(size: 10pt)

#textbox(x: 13em, y: 20em, w: 36em, h: 20em)[
  #import "@preview/cetz:0.3.4"
  #align(center)[
  // TikZ used x=1.1cm, y=0.6cm — scale y by 0.6/1.1 ≈ 0.545
  #cetz.canvas(length: 1.1cm, {
    import cetz.draw: *
    let annotate-color = rgb("#0066CC")
    let sy = 0.6 / 1.1  // y-scale factor

    // axes
    line((-0.2, 0), (4.8, 0), stroke: 0.6pt + annotate-color, mark: (end: ">"))
    line((0, -0.4 * sy), (0, 6.2 * sy), stroke: 0.6pt + annotate-color, mark: (end: ">"))
    content((4.7, -0.3 * sy), text(fill: annotate-color, $x$))
    content((-0.3, 6.0 * sy), text(fill: annotate-color, $y$))

    // curve  3x²-4x+1
    let f(x) = (3 * x * x - 4 * x + 1) * sy
    let pts = range(0, 121).map(i => {
      let x = -0.2 + i * 2.8 / 120
      (x, f(x))
    })
    line(..pts, stroke: 0.8pt + annotate-color)

    // shaded area 0..2
    let fill-pts = range(0, 41).map(i => {
      let x = i * 2.0 / 40
      (x, f(x))
    })
    line((0, 0), ..fill-pts, (2, 0), close: true, fill: annotate-color.transparentize(82%), stroke: none)

    // vertical edges
    line((0, 0), (0, 1 * sy), stroke: 0.6pt + annotate-color)
    line((2, 0), (2, 5 * sy), stroke: 0.6pt + annotate-color)

    // labels
    content((0, -0.3 * sy), text(fill: annotate-color, $0$))
    content((2, -0.3 * sy), text(fill: annotate-color, $2$))
    content((0.45, 0.7 * sy), text(fill: annotate-color, $1$))
  })]
]

#textbox(x: 13em, y: 44em, w: 36em, h: 20em)[
  $
  integral_0^2 (3x^2 - 4x + 1) dif x
  = [x^3 - 2x^2 + x]_0^2
  = (8 - 8 + 2) - 0
  = #box(stroke: 0.5pt + rgb("#0066CC"), inset: 3pt, $2$)
  $
]
