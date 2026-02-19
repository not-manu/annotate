import { spawn } from "child_process";
import { CompilerBase } from "../base";
import type { CompileOptions } from "../base";

class XeLatex extends CompilerBase {
  readonly name = "xelatex";
  protected readonly command = "xelatex";
  readonly sourceExtension = ".tex";
  readonly styleExtensions = [".sty"];

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
