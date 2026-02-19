function generateStyle(): string {
  return `// Annotate – shared Typst style file
// Import this from every page file with: #import "style.typ": *

// ── Brand colour ─────────────────────────────────────────────────────────────

/// The Annotate brand colour.
#let annotate = rgb("#2F968D")

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

// ── Answer / blank space ─────────────────────────────────────────────────────

/// Insert vertical blank space (default ≈ 1.2 in).
#let answer-space(height: 86.4pt) = v(height)

// ── textbox ──────────────────────────────────────────────────────────────────

/// Place a text box at an absolute position on the page.
///
/// - x (length):   horizontal distance from the left edge  (default: 1in)
/// - y (length):   vertical distance from the top edge     (default: 1in)
/// - width (length):  box width                            (default: 2in)
/// - height (length): box height                           (default: 1in)
/// - color (color):   text and border colour               (default: annotate)
/// - border (bool):   draw a border around this box        (default: false)
/// - content:         the text / content inside the box
///
/// Example:
///   #textbox(x: 1in, y: 2in, width: 3in, height: 0.5in, border: true)[Hello!]
///   #textbox(x: 1in, y: 2in, width: 3in, height: 0.5in, color: red)[Hello!]
#let textbox(
  x: 1in,
  y: 1in,
  width: 2in,
  height: 1in,
  color: annotate,
  border: false,
  content,
) = place(
  top + left,
  dx: x,
  dy: y,
  rect(
    width: width,
    height: height,
    inset: 0pt,
    stroke: if border { color + 0.6pt } else { none },
    fill: none,
    align(top + left, text(fill: color, content)),
  ),
)
`;
}

export { generateStyle };
