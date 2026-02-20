// Annotate – shared Typst style file
// Import this from every page file with: #import "style.typ": *

// ── Colour helpers ───────────────────────────────────────────────────────────

/// Wrap content in a coloured box (default: yellow highlight).
#let annotation-box(content, fill: yellow) = box(
  fill: fill,
  inset: 2pt,
  content,
)

/// Place an absolutely-positioned overlay layer on the page.
/// Pass a function that receives (width, height) and returns content.
#let annotation-layer(body) = {
  place(top + left, dx: 0pt, dy: 0pt, body)
}

// ── Typography ───────────────────────────────────────────────────────────────

#let annotation-text(content, color: red, size: 10pt) = text(
  fill: color,
  size: size,
  content,
)

// ── Textbox: positioned text box on the page ────────────────────────────────

/// Place a text box at exact (x, y) from the top-left corner.
/// Default text colour is #24837B. Toggle border per box with border: true.
/// pad controls inner padding (default 0pt; use pad: 4pt for comfortable text).
#let textbox(x: 0pt, y: 0pt, w: 2in, h: 0.5in, pad: 0pt, border: false, body) = {
  place(
    top + left,
    dx: x,
    dy: y,
    block(
      width: w,
      height: h,
      inset: pad,
      align: top + left,
      stroke: if border { rgb("#24837B") } else { none },
      text(fill: rgb("#24837B"), body),
    ),
  )
}

// ── Answer / blank space ─────────────────────────────────────────────────────

/// Insert vertical blank space (default ≈ 1.2 in).
#let answer-space(height: 86.4pt) = v(height)
