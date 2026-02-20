import { Core } from "../../../core";

function generateStyle(): string {
  return `\\NeedsTeXFormat{LaTeX2e}
\\ProvidesPackage{style}[2026/02/19 Annotate defaults]

\\usepackage[T1]{fontenc}
\\usepackage{lmodern}

\\usepackage{geometry}
\\usepackage{xcolor}
\\usepackage{graphicx}
\\usepackage{tikz}

\\usepackage{amsmath, amssymb, amsthm}
\\usepackage{enumitem}
\\usepackage{fancyhdr}

\\usepackage{hyperref}
\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=black}

\\pagestyle{empty}

\\definecolor{annotate}{HTML}{${Core.BRAND_COLOR}}

\\newcommand{\\annotationcolor}[1]{\\color{#1}}
\\newcommand{\\annotationbox}[2][yellow]{\\begingroup\\setlength{\\fboxsep}{2pt}\\colorbox{#1}{#2}\\endgroup}
\\newcommand{\\annotationlayer}[1]{\\begin{tikzpicture}[remember picture,overlay]#1\\end{tikzpicture}}
\\newcommand{\\answerspace}[1][1.2in]{\\par\\vspace{#1}}

% ── textbox: positioned text box on the page ─────────────────────────────────
% Usage: \\textbox[x=.., y=.., w=.., h=.., pad=.., border]{content}
%
% Coordinates are from the top-left corner of the page.
% pad controls inner padding (default 0pt; use pad=4pt for comfortable text).
% Default text colour is annotate (#${Core.BRAND_COLOR}).
%
\\makeatletter
\\tikzset{tb@borderstyle/.style={}}%
\\pgfkeys{
  /textbox/.cd,
  x/.store in=\\tb@x,       x=0pt,
  y/.store in=\\tb@y,       y=0pt,
  w/.store in=\\tb@w,       w=2in,
  h/.store in=\\tb@h,       h=0.5in,
  pad/.store in=\\tb@pad,   pad=0pt,
  border/.code={\\tikzset{tb@borderstyle/.style={draw=annotate}}},
}
\\newcommand{\\textbox}[2][]{%
  \\begingroup
  \\tikzset{tb@borderstyle/.style={}}%
  \\pgfkeys{/textbox/.cd,#1}%
  \\begin{tikzpicture}[remember picture,overlay]
    \\node[
      anchor=north west,
      inner sep=\\tb@pad,
      align=left,
      text=annotate,
      tb@borderstyle,
    ] at ([xshift=\\tb@x,yshift=-\\tb@y]current page.north west)
      {\\parbox[t][\\tb@h][t]{\\tb@w}{\\raggedright #2}};
  \\end{tikzpicture}%
  \\endgroup
}
\\makeatother

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
