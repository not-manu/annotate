# annotate

![Hero — terminal showing annotate in action with a calculus homework PDF being annotated](https://placehold.co/900x500/1a1a2e/0066CC?text=annotate+in+action&font=source-sans-pro)
<!-- Replace with: a screenshot or screen recording of `annotate watch` running in a terminal, showing the TUI with per-page compile status and the annotated PDF open side-by-side -->

## How it works

You point it at a PDF. It creates a page file for every page. You write LaTeX or Typst in those files. It compiles, overlays, and watches — all in real time.

```sh
annotate homework.pdf --with latex
```

That's it. Open the annotated PDF in any viewer and start writing.

![Workflow diagram — original PDF → page files → compiled overlay → annotated PDF](https://placehold.co/900x280/0d1117/c9d1d9?text=PDF+→+page+files+→+overlay+→+annotated+PDF&font=source-sans-pro)
<!-- Replace with: a simple diagram showing the flow from original PDF to per-page .tex/.typ files to the final annotated output -->

## Features

- **Real-time watch mode** — edit a page file, see the result instantly
- **LaTeX & Typst** — use whichever you prefer
- **Exact page dimensions** — overlays match the original PDF's page sizes
- **Built-in style macros** — positioned text boxes, annotation layers, color helpers
- **Image generation** — export annotated pages as PNGs with `--images`
- **Keyboard shortcuts** — copy source, copy errors, navigate pages, all from the terminal

## Quickstart

### Prerequisites

You need [Bun](https://bun.sh) and one of these compilers in your `$PATH`:

| LaTeX | Typst |
|-------|-------|
| [Tectonic](https://tectonic-typesetting.github.io/) (recommended) | [Typst](https://typst.app/) |
| latexmk | |
| pdflatex | |
| xelatex | |

> **Note:** LaTeX engines other than Tectonic have had limited testing. If you run into issues, please open an issue.

### Install

```sh
# clone and install
git clone https://github.com/not-manu/annotate.git
cd annotate
bun install
```

### Create a project

```sh
# with latex
annotate my-paper.pdf --with latex

# with typst
annotate my-paper.pdf --with typst
```

This creates a project folder with one page file per PDF page:

```
my-paper/
  pages/
    style.sty          # shared macros (auto-generated)
    page-01.tex        # annotation for page 1
    page-02.tex        # annotation for page 2
    ...
  .annotate/           # internal build files
  my-paper-annotated.pdf
```

Edit any page file. The watcher recompiles and updates the annotated PDF automatically.

![Project structure — file tree next to an editor showing a page file](https://placehold.co/900x400/0d1117/c9d1d9?text=project+structure+%26+editor&font=source-sans-pro)
<!-- Replace with: a screenshot showing the project folder structure in a file tree alongside an editor with a .tex or .typ file open -->

## Usage

### Watch mode

If you already have a project, resume watching with:

```sh
annotate watch my-paper/
# or just point at the pdf again
annotate my-paper.pdf
```

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `j` / `↓` | Navigate down |
| `k` / `↑` | Navigate up |
| `c` | Copy page source to clipboard |
| `e` | Copy error log to clipboard |
| `q` / `Ctrl+C` | Quit |

### Generating images

Use `--images` to export 300 DPI PNGs of each annotated page into `img/`:

```sh
annotate my-paper.pdf --with latex --images
```

Requires `pdftoppm` (poppler) or `mutool` (mupdf-tools) in your `$PATH`.

## Built-in macros

Both LaTeX and Typst projects come with a style file full of helpers. Here are the main ones:

### `\textbox` / `#textbox` — positioned text box

Place text at an exact position on the page. Coordinates are from the **top-left corner**.

**LaTeX:**
```latex
\textbox[x=1in, y=2in, w=3in, h=1in]{
  Your annotation here.
}

% debug borders to see the box outline
\textbox[x=1in, y=2in, w=3in, border]{
  Where exactly am I?
}
```

**Typst:**
```typst
#textbox(x: 1in, y: 2in, w: 3in, h: 1in)[
  Your annotation here.
]

// debug borders
#textbox(x: 1in, y: 2in, w: 3in, border: true)[
  Where exactly am I?
]
```

![Textbox demo — a PDF page with positioned annotation boxes overlaid](https://placehold.co/900x500/1a1a2e/0066CC?text=textbox+positioning+demo&font=source-sans-pro)
<!-- Replace with: a screenshot showing textbox annotations positioned on a PDF page, ideally with one box showing border: true for contrast -->

### Other helpers

| LaTeX | Typst | What it does |
|-------|-------|-------------|
| `\annotationcolor{red}` | `#annotation-text(color: red)[...]` | Colored annotation text |
| `\annotationbox[yellow]{...}` | `#annotation-box(fill: yellow)[...]` | Highlighted box |
| `\annotationlayer{...}` | `#annotation-layer[...]` | TikZ/absolute overlay layer |
| `\answerspace[1.2in]` | `#answer-space(height: 1.2in)` | Vertical blank space |

### Working with figures & diagrams

Use `\annotationlayer` (LaTeX) or `#annotation-layer` (Typst) for TikZ or Cetz diagrams. The examples folder has full calculus homework demos with graphs, piecewise functions, and integrals.

**LaTeX (TikZ):**
```latex
\annotationlayer{
  \draw[thick, blue, ->] (0,0) -- (4,0) node[right] {$x$};
  \draw[thick, blue, ->] (0,-2) -- (0,2) node[above] {$y$};
  \draw[domain=0:3.5, smooth, red, thick] plot (\x, {sin(\x r)});
}
```

## Examples

The `examples/` folder contains complete annotated homework projects for both LaTeX and Typst — calculus problems with equations, graphs, and positioned annotations.

```sh
# look at the latex example
annotate watch examples/latex/homework/

# look at the typst example
annotate watch examples/typst/homework/
```

![Example output — side by side of original and annotated PDF](https://placehold.co/900x500/0d1117/c9d1d9?text=before+%26+after&font=source-sans-pro)
<!-- Replace with: a side-by-side comparison of the original homework PDF and the annotated version with solutions overlaid -->

## Supported compilers

| Compiler | Language | Auto-detected | Notes |
|----------|----------|--------------|-------|
| Tectonic | LaTeX | Yes (preferred) | Self-contained, no TeX Live needed |
| latexmk | LaTeX | Yes | Requires TeX Live / MacTeX |
| pdflatex | LaTeX | Yes | Requires TeX Live / MacTeX |
| xelatex | LaTeX | Yes | Requires TeX Live / MacTeX |
| Typst | Typst | Yes | Standalone binary |

The first available compiler is used automatically. No configuration needed.

> **Heads up:** Tectonic is the most tested LaTeX engine. If you're using pdflatex, xelatex, or latexmk and something breaks, please let me know — I'd love help testing across engines.

---

<p align="center">

![annotate](https://placehold.co/600x120/1a1a2e/0066CC?text=annotate&font=source-sans-pro)
<!-- Replace with: a minimal banner/logo for annotate — blue (#0066CC) text on dark background, clean and simple -->

made with care by [not-manu](https://github.com/not-manu)

</p>
