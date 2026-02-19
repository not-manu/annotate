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

\\definecolor{annotate}{HTML}{2F968D}

\\newcommand{\\annotationcolor}[1]{\\color{#1}}
\\newcommand{\\annotationbox}[2][yellow]{\\begingroup\\setlength{\\fboxsep}{2pt}\\colorbox{#1}{#2}\\endgroup}
\\newcommand{\\annotationlayer}[1]{\\begin{tikzpicture}[remember picture,overlay]#1\\end{tikzpicture}}
\\newcommand{\\answerspace}[1][1.2in]{\\par\\vspace{#1}}

% ── textbox: positioned text box on the page ─────────────────────────────────
% Usage: \\textbox[options]{x}{y}{width}{height}{content}
%
% Keys:
%   border = true | false   (default: false)
%
% Coordinates are from the top-left corner of the page.
% Default text colour is annotate (#2F968D).
%
\\makeatletter
\\newif\\if@tb@border
\\pgfkeys{
  /textbox/.cd,
  border/.is if=@tb@border,
  border/.default=true,
  border=false,
}
\\newcommand{\\textbox}[6][]{%
  \\begingroup
  \\pgfkeys{/textbox/.cd,#1}%
  \\begin{tikzpicture}[remember picture,overlay]
    \\node[
      anchor=north west,
      text width=#4,
      minimum height=#5,
      inner sep=4pt,
      align=left,
      text=annotate,
      \\if@tb@border draw=annotate,\\fi
    ] at ([xshift=#2,yshift=-#3]current page.north west) {#6};
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
