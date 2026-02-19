import path from "path";
import { spawn } from "child_process";
import { CompilerBase } from "../base";
import type { CompileOptions } from "../base";

class TypstCompiler extends CompilerBase {
  readonly name = "Typst";
  protected readonly command = "typst";
  readonly sourceExtension = ".typ";
  readonly styleExtensions = [".typ"];

  async isAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn(this.command, ["--version"], {
        stdio: "ignore",
      });

      child.on("error", () => resolve(false));
      child.on("close", (code) => resolve(code === 0));
    });
  }

  protected buildArgs(options: CompileOptions): string[] {
    const outputPath = path.join(
      options.outputDir,
      `${path.parse(options.inputPath).name}.pdf`
    );
    return ["compile", options.inputPath, outputPath];
  }
}

export { TypstCompiler };
