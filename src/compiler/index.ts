import fs from "fs";
import path from "path";
import { AnnotateError } from "../error";
import { CompilerBase } from "./base";
import type { CompileOptions, CompileResult } from "./base";
import { Flavor as FlavorNamespace } from "./flavor";
import { Tectonic } from "./tectonic";

type CompileAllOptions = {
  compiler: CompilerBase;
  pagesDir: string;
  buildDir: string;
};

type WatchHandle = {
  stop: () => void;
};

type DetectOptions = {
  flavor: FlavorNamespace.Type;
};

namespace Compiler {
  export import Flavor = FlavorNamespace;

  function buildTexInputs(pagesDir: string): string {
    const separator = path.delimiter;
    const existing = process.env.TEXINPUTS ?? "";
    const parts = [pagesDir, existing].filter(Boolean).join(separator);
    if (parts.endsWith(separator)) {
      return parts;
    }
    return `${parts}${separator}`;
  }

  async function compileSingle(
    compiler: CompilerBase,
    options: CompileOptions
  ): Promise<CompileResult> {
    return compiler.compile(options);
  }

  function logResult(result: CompileResult): void {
    const name = path.basename(result.inputPath);
    if (result.success) {
      console.log(`Compiled ${name} ✓`);
      return;
    }
    console.log(
      `Failed ${name} ✗ (see ${path.basename(result.errorLogPath)})`
    );
  }

  export async function detect(options: DetectOptions): Promise<CompilerBase> {
    if (options.flavor === "latex") {
      const tectonic = new Tectonic();
      if (await tectonic.isAvailable()) {
        return tectonic;
      }

      throw new AnnotateError({
        message: "No supported LaTeX compiler was found.",
        hint: "Install tectonic and make sure it is available in your PATH.",
      });
    }

    throw new AnnotateError({
      message: `The ${options.flavor} compiler is not implemented yet.`,
      hint: "Use --with latex for now.",
    });
  }

  export async function compileAll(
    options: CompileAllOptions
  ): Promise<CompileResult[]> {
    const files = await fs.promises.readdir(options.pagesDir);
    const targets = files
      .filter((file) => file.startsWith("page-") && file.endsWith(".tex"))
      .sort();

    const texInputs = buildTexInputs(options.pagesDir);
    const compileTasks = targets.map((file) => {
      const inputPath = path.join(options.pagesDir, file);
      const errorLogPath = path.join(
        options.pagesDir,
        `${path.parse(file).name}.error.log`
      );

      return compileSingle(options.compiler, {
        inputPath,
        outputDir: options.buildDir,
        errorLogPath,
        extraEnv: { TEXINPUTS: texInputs },
      });
    });

    const results = await Promise.all(compileTasks);
    results.forEach(logResult);
    return results;
  }

  export function watch(options: CompileAllOptions): WatchHandle {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const pending = new Set<string>();

    const watcher = fs.watch(options.pagesDir, (eventType, filename) => {
      if (!filename) {
        return;
      }

      if (eventType === "rename" || eventType === "change") {
        pending.add(filename.toString());
      }

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(async () => {
        const changed = Array.from(pending);
        pending.clear();

        const hasStyleChange = changed.includes("style.sty");
        const texInputs = buildTexInputs(options.pagesDir);

        if (hasStyleChange) {
          await compileAll(options);
          return;
        }

        const texTargets = changed
          .filter((file) => file.endsWith(".tex"))
          .filter((file) => file.startsWith("page-"));

        const tasks = texTargets.map((file) => {
          const inputPath = path.join(options.pagesDir, file);
          const errorLogPath = path.join(
            options.pagesDir,
            `${path.parse(file).name}.error.log`
          );

          return compileSingle(options.compiler, {
            inputPath,
            outputDir: options.buildDir,
            errorLogPath,
            extraEnv: { TEXINPUTS: texInputs },
          });
        });

        const results = await Promise.all(tasks);
        results.forEach(logResult);
      }, 200);
    });

    return {
      stop: () => watcher.close(),
    };
  }
}

export { Compiler };
export type { CompileAllOptions, WatchHandle };
