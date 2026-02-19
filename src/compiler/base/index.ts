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

  abstract isAvailable(): Promise<boolean>;
  protected abstract buildArgs(options: CompileOptions): string[];

  protected buildEnv(options: CompileOptions): NodeJS.ProcessEnv {
    return {
      ...process.env,
      ...options.extraEnv,
    };
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

      child.stdout?.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr?.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("error", (error) => {
        reject(error);
      });

      child.on("close", async (code) => {
        const success = code === 0;

        if (!success) {
          const logContent = [stdout, stderr].filter(Boolean).join("\n");
          await fs.promises.writeFile(options.errorLogPath, logContent);
        } else if (fs.existsSync(options.errorLogPath)) {
          await fs.promises.unlink(options.errorLogPath);
        }

        resolve({
          success,
          code,
          stdout,
          stderr,
          inputPath: options.inputPath,
          outputPath,
          errorLogPath: options.errorLogPath,
        });
      });
    });
  }
}

export { CompilerBase };
export type { CompileOptions, CompileResult };
