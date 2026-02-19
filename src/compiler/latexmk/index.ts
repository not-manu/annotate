import { spawn } from "child_process";
import { CompilerBase } from "../base";
import type { CompileOptions } from "../base";

class LatexMk extends CompilerBase {
  readonly name = "latexmk";
  protected readonly command = "latexmk";
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
      "-pdf",
      "-interaction=nonstopmode",
      "-halt-on-error",
      `-output-directory=${options.outputDir}`,
      options.inputPath,
    ];
  }
}

export { LatexMk };
