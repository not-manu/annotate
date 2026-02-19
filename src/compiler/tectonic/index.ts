import { spawn } from "child_process";
import { CompilerBase } from "../base";
import type { CompileOptions } from "../base";

class Tectonic extends CompilerBase {
  readonly name = "Tectonic";
  protected readonly command = "tectonic";

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
    return [options.inputPath, "-o", options.outputDir];
  }
}

export { Tectonic };
