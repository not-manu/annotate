function generateStyle(): string {
  return `// Annotate – shared Typst style file
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

// ── Answer / blank space ─────────────────────────────────────────────────────

/// Insert vertical blank space (default ≈ 1.2 in).
#let answer-space(height: 86.4pt) = v(height)
`;
}

export { generateStyle };
