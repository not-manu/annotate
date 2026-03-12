import { LatexCompilerBase } from "./latex-base";
import type { CompileOptions } from "./base";

class XeLatex extends LatexCompilerBase {
  readonly name = "xelatex";
  protected readonly command = "xelatex";

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

export { XeLatex };
