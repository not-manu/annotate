type PageTemplateOptions = {
  pageNumber: number;
  width: number;
  height: number;
};

function formatDimension(value: number): string {
  // bp (big points) are the PDF/PostScript unit; 1bp = 1/72 inch.
  // Typst accepts "pt" which is identical to bp when used with its default
  // 72 dpi point size, so we use "pt" here to stay in PDF native units.
  return `${value.toFixed(2)}pt`;
}

function generatePage(options: PageTemplateOptions): string {
  const width = formatDimension(options.width);
  const height = formatDimension(options.height);

  return `#import "style.typ": *

#set page(width: ${width}, height: ${height}, margin: 0pt)
#set text(size: 10pt)

// Page ${options.pageNumber} annotations go here.
`;
}

export { generatePage };
