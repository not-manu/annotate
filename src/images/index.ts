import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { AnnotateError } from "../error";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GenerateOptions = {
  /** Path to the PDF to rasterize (typically the annotated output PDF). */
  pdfPath: string;
  /** Directory where page-NN.png files will be written. */
  outputDir: string;
  /** Resolution in dots-per-inch (default: 300). */
  dpi?: number;
};

type Tool = "pdftoppm" | "mutool";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

namespace Images {
  async function isCommandAvailable(command: string): Promise<boolean> {
    return new Promise((resolve) => {
      const child = spawn(command, ["--version"], { stdio: "ignore" });
      child.on("error", () => resolve(false));
      child.on("close", (code) => resolve(code === 0 || code === 1));
    });
  }

  /** Detect the first available rasterization tool, preferring pdftoppm. */
  export async function detectTool(): Promise<Tool> {
    if (await isCommandAvailable("pdftoppm")) return "pdftoppm";
    if (await isCommandAvailable("mutool")) return "mutool";

    throw new AnnotateError({
      message: "No supported PDF rasterizer was found.",
      hint: "Install poppler (for pdftoppm) or mupdf-tools (for mutool) and make sure they are available in your PATH.",
    });
  }

  /**
   * Run pdftoppm to rasterize all pages to PNG files.
   *
   * Produces: <outputDir>/page-01.png, page-02.png, ...
   * (pdftoppm zero-pads and appends page numbers to the prefix)
   */
  async function runPdftoppm(
    pdfPath: string,
    outputDir: string,
    dpi: number
  ): Promise<void> {
    const prefix = path.join(outputDir, "page");
    const args = ["-png", "-r", String(dpi), pdfPath, prefix];

    return new Promise((resolve, reject) => {
      const child = spawn("pdftoppm", args);
      let stderr = "";
      child.stderr?.on("data", (chunk) => { stderr += chunk.toString(); });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`pdftoppm exited with code ${code}: ${stderr.trim()}`));
        }
      });
    });
  }

  /**
   * Run mutool to rasterize all pages to PNG files.
   *
   * Produces: <outputDir>/page-%d.png  (mutool uses 1-based %d by default)
   * We rename afterwards to normalise to zero-padded names.
   */
  async function runMutool(
    pdfPath: string,
    outputDir: string,
    dpi: number
  ): Promise<void> {
    const outputPattern = path.join(outputDir, "page-%d.png");
    const args = ["convert", "-o", outputPattern, "-r", String(dpi), pdfPath];

    return new Promise((resolve, reject) => {
      const child = spawn("mutool", args);
      let stderr = "";
      child.stderr?.on("data", (chunk) => { stderr += chunk.toString(); });
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`mutool exited with code ${code}: ${stderr.trim()}`));
        }
      });
    });
  }

  /**
   * Rename files produced by a tool into a consistent zero-padded format.
   *
   * pdftoppm  → page-1.png, page-2.png  (or page-01.png depending on count)
   * mutool    → page-1.png, page-2.png
   *
   * Target format: page-01.png, page-02.png, ... (padding width = digits in count)
   */
  async function normaliseNames(outputDir: string): Promise<void> {
    const entries = await fs.promises.readdir(outputDir);
    const pageFiles = entries
      .filter((f) => /^page-?\d+\.png$/i.test(f))
      .sort();

    if (pageFiles.length === 0) return;

    const pad = Math.max(2, String(pageFiles.length).length);

    for (const file of pageFiles) {
      const match = file.match(/(\d+)\.png$/i);
      if (!match) continue;
      const num = parseInt(match[1]!, 10);
      const newName = `page-${String(num).padStart(pad, "0")}.png`;
      if (file !== newName) {
        await fs.promises.rename(
          path.join(outputDir, file),
          path.join(outputDir, newName)
        );
      }
    }
  }

  /**
   * Generate 300 DPI PNG images for every page of `pdfPath` into `outputDir`.
   *
   * Auto-detects the available rasterization tool (pdftoppm preferred, mutool
   * as fallback) and normalises output file names to `page-01.png` format.
   */
  export async function generate(options: GenerateOptions): Promise<void> {
    const { pdfPath, outputDir, dpi = 300 } = options;

    await fs.promises.mkdir(outputDir, { recursive: true });

    const tool = await detectTool();

    if (tool === "pdftoppm") {
      await runPdftoppm(pdfPath, outputDir, dpi);
    } else {
      await runMutool(pdfPath, outputDir, dpi);
    }

    await normaliseNames(outputDir);
  }
}

export { Images };
export type { GenerateOptions, Tool };
