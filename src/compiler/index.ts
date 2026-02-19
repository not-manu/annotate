import fs from "fs";
import path from "path";
import { AnnotateError } from "../error";
import { PDF } from "../project/pdf";
import { CompilerBase } from "./base";
import type { CompileOptions } from "./base";
import { CompilerEmitter } from "./emitter";
import { Flavor as FlavorNamespace } from "./flavor";
import { Tectonic } from "./tectonic";

type DetectOptions = {
  flavor: FlavorNamespace.Type;
};

type OverlayOptions = {
  originalPath: string;
  outputPath: string;
};

type CompileAllOptions = {
  compiler: CompilerBase;
  pagesDir: string;
  buildDir: string;
  emitter: CompilerEmitter;
  overlay: OverlayOptions;
};

type WatchHandle = {
  stop: () => void;
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

  function buildCompileOptions(
    file: string,
    options: CompileAllOptions
  ): CompileOptions {
    return {
      inputPath: path.join(options.pagesDir, file),
      outputDir: options.buildDir,
      errorLogPath: path.join(
        options.pagesDir,
        `${path.parse(file).name}.error.log`
      ),
      extraEnv: { TEXINPUTS: buildTexInputs(options.pagesDir) },
    };
  }

  async function compileFile(
    file: string,
    options: CompileAllOptions
  ): Promise<void> {
    const compileOptions = buildCompileOptions(file, options);
    options.emitter.emit("compile:start", { inputPath: compileOptions.inputPath });
    const result = await options.compiler.compile(compileOptions);
    options.emitter.emit("compile:end", result);
  }

  async function runOverlay(options: CompileAllOptions): Promise<void> {
    try {
      await PDF.overlay({
        originalPath: options.overlay.originalPath,
        buildDir: options.buildDir,
        outputPath: options.overlay.outputPath,
      });
      options.emitter.emit("overlay:end", {
        outputPath: options.overlay.outputPath,
        success: true,
      });
    } catch {
      options.emitter.emit("overlay:end", {
        outputPath: options.overlay.outputPath,
        success: false,
      });
    }
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

  export async function compileAll(options: CompileAllOptions): Promise<void> {
    const files = await fs.promises.readdir(options.pagesDir);
    const targets = files
      .filter((file) => file.startsWith("page-") && file.endsWith(".tex"))
      .sort();

    await Promise.all(targets.map((file) => compileFile(file, options)));
    await runOverlay(options);
  }

  export function watch(options: CompileAllOptions): WatchHandle {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const pending = new Set<string>();

    const watcher = fs.watch(options.pagesDir, (eventType, filename) => {
      if (!filename) return;

      if (eventType === "rename" || eventType === "change") {
        pending.add(filename.toString());
      }

      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(async () => {
        const changed = Array.from(pending);
        pending.clear();

        const hasStyleChange = changed.some((f) => f.endsWith(".sty"));

        if (hasStyleChange) {
          await compileAll(options);
          return;
        }

        const texTargets = changed.filter(
          (f) => f.startsWith("page-") && f.endsWith(".tex")
        );

        await Promise.all(texTargets.map((file) => compileFile(file, options)));
        await runOverlay(options);
      }, 200);
    });

    return { stop: () => watcher.close() };
  }
}

export { Compiler, CompilerEmitter };
export type { CompileAllOptions, DetectOptions, OverlayOptions, WatchHandle };
