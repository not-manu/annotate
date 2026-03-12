import path from "path";
import { CompilerBase } from "./base";
import type { CompileOptions } from "./base";

class TypstCompiler extends CompilerBase {
  readonly name = "Typst";
  protected readonly command = "typst";
  readonly sourceExtension = ".typ";
  readonly styleExtensions = [".typ"];

  protected buildArgs(options: CompileOptions): string[] {
    const outputPath = path.join(
      options.outputDir,
      `${path.parse(options.inputPath).name}.pdf`
    );
    return ["compile", options.inputPath, outputPath];
  }
}

export { TypstCompiler };
