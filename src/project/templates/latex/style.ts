function generateStyle(): string {
  return `\\NeedsTeXFormat{LaTeX2e}
\\ProvidesPackage{style}[2026/02/19 Annotate defaults]

\\usepackage[T1]{fontenc}
\\usepackage{lmodern}

\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{graphicx}
\\usepackage{tikz}
\\usetikzlibrary{calc}

\\usepackage{amsmath, amssymb, amsthm}
\\usepackage{enumitem}
\\usepackage{fancyhdr}

\\usepackage{hyperref}
\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=black}

\\pagestyle{empty}

% ── Brand colour ──────────────────────────────────────────────────────────────
\\definecolor{annotate}{HTML}{2F968D}

% ── Legacy helpers ────────────────────────────────────────────────────────────
\\newcommand{\\annotationcolor}[1]{\\color{#1}}
\\newcommand{\\annotationbox}[2][yellow]{\\begingroup\\setlength{\\fboxsep}{2pt}\\colorbox{#1}{#2}\\endgroup}
\\newcommand{\\annotationlayer}[1]{\\begin{tikzpicture}[remember picture,overlay]#1\\end{tikzpicture}}
\\newcommand{\\answerspace}[1][1.2in]{\\par\\vspace{#1}}

% ── \\textbox ──────────────────────────────────────────────────────────────────
% Place a text box at an absolute position on the page.
%
% Usage:
%   \\textbox[<options>]{<content>}
%
% Options (all optional):
%   x=<length>      horizontal distance from left edge  (default: 1in)
%   y=<length>      vertical distance from top edge     (default: 1in)
%   width=<length>  box width                           (default: 2in)
%   height=<length> box height                          (default: 1in)
%   color=<color>   text and border colour              (default: annotate)
%   border          draw a border around this box       (default: off)
%
% Example:
%   \\textbox[x=1in, y=2in, width=3in, height=0.5in, border]{Hello!}
%   \\textbox[x=1in, y=2in, width=3in, height=0.5in, color=red]{Hello!}

\\pgfkeys{
  /textbox/.is family, /textbox,
  x/.store in      = \\textbox@x,
  y/.store in      = \\textbox@y,
  width/.store in  = \\textbox@width,
  height/.store in = \\textbox@height,
  color/.store in  = \\textbox@color,
  border/.is if    = iftextboxborder,
  x      = 1in,
  y      = 1in,
  width  = 2in,
  height = 1in,
  color  = annotate,
}

\\newif\\iftextboxborder

\\newcommand{\\textbox}[2][]{%
  \\pgfkeys{/textbox, border=false, #1}%
  \\begin{tikzpicture}[remember picture, overlay]
    \\node[
      anchor        = north west,
      inner sep     = 0pt,
      outer sep     = 0pt,
      text width    = \\textbox@width,
      minimum width = \\textbox@width,
      minimum height= \\textbox@height,
      align         = left,
      text          = \\textbox@color,
      draw          = \\iftextboxborder\\textbox@color\\else none\\fi,
      line width    = 0.6pt,
    ] at (\\$(current page.north west) + (\\textbox@x, -\\textbox@y)\\$)
      {\\vbox to \\textbox@height{\\vskip0pt #2\\vfil}};
  \\end{tikzpicture}%
}

% ── Theorem environments ───────────────────────────────────────────────────────
\\theoremstyle{definition}
\\newtheorem{definition}{Definition}[section]
\\newtheorem{theorem}[definition]{Theorem}
\\newtheorem{lemma}[definition]{Lemma}
\\newtheorem{corollary}[definition]{Corollary}

\\newenvironment{defbox}[1][]{\\medskip\\noindent\\textbf{#1.}\\itshape\\quad}{\\medskip}
\\newenvironment{hintbox}[1][Hint]{\\smallskip\\noindent\\textit{#1.}\\quad\\small}{\\smallskip}
`;
}

export { generateStyle };
