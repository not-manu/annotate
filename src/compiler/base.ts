import fs from "fs";
import path from "path";
import { spawn } from "child_process";

type CompileOptions = {
  inputPath: string;
  outputDir: string;
  errorLogPath: string;
  workingDir?: string;
  extraEnv?: NodeJS.ProcessEnv;
};

type CompileResult = {
  success: boolean;
  code: number | null;
  stdout: string;
  stderr: string;
  inputPath: string;
  outputPath: string;
  errorLogPath: string;
};

abstract class CompilerBase {
  abstract readonly name: string;
  protected abstract readonly command: string;

  /** File extension for source files, including the dot (e.g. ".tex", ".typ") */
  abstract readonly sourceExtension: string;

  /**
   * File extensions that, when changed, should trigger a full recompile of all
   * pages (e.g. shared style/package files). Include the dot.
   */
  abstract readonly styleExtensions: string[];

  protected abstract buildArgs(options: CompileOptions): string[];

  async isAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn(this.command, ["--version"], { stdio: "ignore" });
      child.on("error", () => resolve(false));
      child.on("close", (code) => resolve(code === 0));
    });
  }

  protected buildEnv(options: CompileOptions): NodeJS.ProcessEnv {
    return { ...process.env, ...options.extraEnv };
  }

  async compile(options: CompileOptions): Promise<CompileResult> {
    const outputPath = path.join(
      options.outputDir,
      `${path.parse(options.inputPath).name}.pdf`
    );

    await fs.promises.mkdir(options.outputDir, { recursive: true });

    const args = this.buildArgs(options);
    const env = this.buildEnv(options);

    return new Promise((resolve, reject) => {
      const child = spawn(this.command, args, {
        cwd: options.workingDir,
        env,
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (chunk) => { stdout += chunk.toString(); });
      child.stderr?.on("data", (chunk) => { stderr += chunk.toString(); });
      child.on("error", (error) => { reject(error); });

      child.on("close", async (code) => {
        const success = code === 0;

        if (!success) {
          const logContent = [stdout, stderr].filter(Boolean).join("\n");
          await fs.promises.writeFile(options.errorLogPath, logContent);
        } else if (fs.existsSync(options.errorLogPath)) {
          await fs.promises.unlink(options.errorLogPath);
        }

        resolve({ success, code, stdout, stderr, inputPath: options.inputPath, outputPath, errorLogPath: options.errorLogPath });
      });
    });
  }
}

export { CompilerBase };
export type { CompileOptions, CompileResult };
