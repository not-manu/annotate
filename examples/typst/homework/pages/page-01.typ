#import "style.typ": *

#set page(width: 612.00pt, height: 792.00pt, margin: 0pt)
#set text(size: 10pt)

#textbox(x: 13em, y: 39em, w: 36em, h: 10em)[
  $
  lim_(x -> 2) frac(x^2 - 4, x - 2)
  = lim_(x -> 2) frac((x - 2)(x + 2), x - 2)
  = lim_(x -> 2) (x + 2)
  = #box(stroke: 0.5pt + rgb("#24837B"), inset: 3pt, $4$)
  $
]

#textbox(x: 13em, y: 57em, w: 36em, h: 10em)[
  $
  f(x) = x^3 ln(x) - frac(4, x^2) = x^3 ln(x) - 4 x^(-2)
  $
  $
  f'(x) = (x^3 ln(x))' - 4(x^(-2))'
  = 3x^2 ln(x) + x^3 dot frac(1, x) + 8x^(-3)
  = #box(stroke: 0.5pt + rgb("#24837B"), inset: 3pt, $3x^2 ln(x) + x^2 + frac(8, x^3)$)
  $
]
