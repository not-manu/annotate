import { LatexCompilerBase } from "./latex-base";
import type { CompileOptions } from "./base";

class PdfLatex extends LatexCompilerBase {
  readonly name = "pdflatex";
  protected readonly command = "pdflatex";

  protected buildArgs(options: CompileOptions): string[] {
    return [
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-output-directory",
      options.outputDir,
      options.inputPath,
    ];
  }
}

export { PdfLatex };
