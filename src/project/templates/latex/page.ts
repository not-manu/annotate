type PageTemplateOptions = {
  pageNumber: number;
  width: number;
  height: number;
};

function formatDimension(value: number): string {
  return `${value.toFixed(2)}bp`;
}

function generatePage(options: PageTemplateOptions): string {
  const width = formatDimension(options.width);
  const height = formatDimension(options.height);

  return `\\documentclass{article}
\\usepackage{style}
\\geometry{paperwidth=${width}, paperheight=${height}, margin=0pt}

\\begin{document}
\\thispagestyle{empty}

\\end{document}
`;
}

export { generatePage };
