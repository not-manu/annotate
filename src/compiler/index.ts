import fs from "fs";
import path from "path";
import { AnnotateError } from "../error";
import { Images } from "../images";
import { PDF } from "../project/pdf";
import { CompilerBase } from "./base";
import type { CompileOptions } from "./base";
import { CompilerEmitter } from "./emitter";
import { Flavor as FlavorNamespace } from "./flavor";
import { LatexMk } from "./latexmk";
import { PdfLatex } from "./pdflatex";
import { Tectonic } from "./tectonic";
import { TypstCompiler } from "./typst";
import { XeLatex } from "./xelatex";

type DetectOptions = {
  flavor: FlavorNamespace.Type;
};

type OverlayOptions = {
  originalPath: string;
  outputPath: string;
};

type ImagesOptions = {
  /** Directory where page-NN.png files will be written (e.g. <project>/img). */
  outputDir: string;
  /** Resolution in dots-per-inch (default: 300). */
  dpi?: number;
};

type CompileAllOptions = {
  compiler: CompilerBase;
  pagesDir: string;
  buildDir: string;
  emitter: CompilerEmitter;
  overlay: OverlayOptions;
  /** When provided, PNG images are generated after every successful overlay. */
  images?: ImagesOptions;
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
    const isLatex = options.compiler.sourceExtension === ".tex";
    return {
      inputPath: path.join(options.pagesDir, file),
      outputDir: options.buildDir,
      errorLogPath: path.join(
        options.pagesDir,
        `${path.parse(file).name}.error.log`
      ),
      extraEnv: isLatex
        ? { TEXINPUTS: buildTexInputs(options.pagesDir) }
        : undefined,
    };
  }

  async function compileFile(
    file: string,
    options: CompileAllOptions,
    emitStart = true
  ): Promise<void> {
    const compileOptions = buildCompileOptions(file, options);
    if (emitStart) {
      options.emitter.emit("compile:start", { inputPath: compileOptions.inputPath });
    }
    const result = await options.compiler.compile(compileOptions);
    options.emitter.emit("compile:end", result);
  }

  function getPageNumberFromFile(file: string): number | null {
    const match = file.match(/^page-(\d+)\.[^.]+$/);
    if (!match) {
      return null;
    }

    const pageNumber = Number.parseInt(match[1] ?? "", 10);
    return Number.isInteger(pageNumber) ? pageNumber : null;
  }

  async function runOverlay(
    options: CompileAllOptions,
    pageNumbers?: number[]
  ): Promise<void> {
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
      return;
    }

    if (options.images) {
      try {
        await Images.generate({
          pdfPath: options.overlay.outputPath,
          outputDir: options.images.outputDir,
          dpi: options.images.dpi,
          pageNumbers,
        });
        options.emitter.emit("images:end", { success: true });
      } catch {
        options.emitter.emit("images:end", { success: false });
      }
    }
  }

  export async function detect(options: DetectOptions): Promise<CompilerBase> {
    if (options.flavor === "latex") {
      const candidates = [
        new Tectonic(),
        new LatexMk(),
        new PdfLatex(),
        new XeLatex(),
      ];

      for (const compiler of candidates) {
        if (await compiler.isAvailable()) {
          return compiler;
        }
      }

      throw new AnnotateError({
        message: "No supported LaTeX compiler was found.",
        hint: "Install tectonic, latexmk, pdflatex, or xelatex and make sure it is available in your PATH.",
      });
    }

    if (options.flavor === "typst") {
      const typst = new TypstCompiler();
      if (await typst.isAvailable()) {
        return typst;
      }

      throw new AnnotateError({
        message: "No supported Typst compiler was found.",
        hint: "Install typst and make sure it is available in your PATH.",
      });
    }

    throw new AnnotateError({
      message: `Unsupported language: '${options.flavor}'.`,
      hint: "Use --with latex or --with typst.",
    });
  }

  export async function compileAll(options: CompileAllOptions): Promise<void> {
    const ext = options.compiler.sourceExtension;
    const files = await fs.promises.readdir(options.pagesDir);
    const targets = files
      .filter((file) => file.startsWith("page-") && file.endsWith(ext))
      .sort();

    // Emit compile:start for all pages immediately so the UI can show spinners
    // before any actual compilation begins.
    for (const file of targets) {
      const compileOptions = buildCompileOptions(file, options);
      options.emitter.emit("compile:start", { inputPath: compileOptions.inputPath });
    }

    await Promise.all(targets.map((file) => compileFile(file, options, false)));
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

        const ext = options.compiler.sourceExtension;
        const styleExts = options.compiler.styleExtensions;

        const hasStyleChange = changed.some((f) =>
          styleExts.some((sExt) => f.endsWith(sExt) && !f.startsWith("page-"))
        );

        if (hasStyleChange) {
          await compileAll(options);
          return;
        }

        const texTargets = changed.filter(
          (f) => f.startsWith("page-") && f.endsWith(ext)
        );

        if (texTargets.length === 0) {
          return;
        }

        const pageNumbers = texTargets
          .map((file) => getPageNumberFromFile(file))
          .filter((pageNumber): pageNumber is number => pageNumber !== null);

        await Promise.all(texTargets.map((file) => compileFile(file, options)));
        await runOverlay(options, pageNumbers);
      }, 200);
    });

    return { stop: () => watcher.close() };
  }
}

export { Compiler, CompilerEmitter };
export type { CompileAllOptions, DetectOptions, ImagesOptions, OverlayOptions, WatchHandle };
