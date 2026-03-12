import { LatexCompilerBase } from "./latex-base";
import type { CompileOptions } from "./base";

class LatexMk extends LatexCompilerBase {
  readonly name = "latexmk";
  protected readonly command = "latexmk";

  protected buildArgs(options: CompileOptions): string[] {
    return [
      "-pdf",
      "-interaction=nonstopmode",
      "-halt-on-error",
      `-output-directory=${options.outputDir}`,
      options.inputPath,
    ];
  }
}

export { LatexMk };
