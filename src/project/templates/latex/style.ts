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

\\newcommand{\\annotationcolor}[1]{\\color{#1}}
\\newcommand{\\annotationbox}[2][yellow]{\\begingroup\\setlength{\\fboxsep}{2pt}\\colorbox{#1}{#2}\\endgroup}
\\newcommand{\\annotationlayer}[1]{\\begin{tikzpicture}[remember picture,overlay]#1\\end{tikzpicture}}
\\newcommand{\\answerspace}[1][1.2in]{\\par\\vspace{#1}}

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
