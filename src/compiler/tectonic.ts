import { LatexCompilerBase } from "./latex-base";
import type { CompileOptions } from "./base";

class Tectonic extends LatexCompilerBase {
  readonly name = "Tectonic";
  protected readonly command = "tectonic";

  protected buildArgs(options: CompileOptions): string[] {
    return [options.inputPath, "-o", options.outputDir];
  }
}

export { Tectonic };
