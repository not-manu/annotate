import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { PDFDocument } from "pdf-lib";
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
  /** Specific 1-based page numbers to rasterize. When omitted, all pages are generated. */
  pageNumbers?: number[];
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

  async function getPageCount(pdfPath: string): Promise<number> {
    const bytes = await fs.promises.readFile(pdfPath);
    const pdf = await PDFDocument.load(bytes);
    return pdf.getPageCount();
  }

  function normalisePageNumbers(
    pageNumbers: number[] | undefined,
    pageCount: number
  ): number[] | null {
    if (!pageNumbers) {
      return null;
    }

    const unique = Array.from(
      new Set(
        pageNumbers.filter(
          (pageNumber) => Number.isInteger(pageNumber) && pageNumber >= 1 && pageNumber <= pageCount
        )
      )
    ).sort((a, b) => a - b);

    return unique;
  }

  function getPageBaseName(pageNumber: number, pad: number): string {
    return `page-${String(pageNumber).padStart(pad, "0")}`;
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

  async function runPdftoppmPage(
    pdfPath: string,
    outputDir: string,
    dpi: number,
    pageNumber: number,
    pad: number
  ): Promise<void> {
    const prefix = path.join(outputDir, getPageBaseName(pageNumber, pad));
    const args = [
      "-png",
      "-r",
      String(dpi),
      "-f",
      String(pageNumber),
      "-l",
      String(pageNumber),
      "-singlefile",
      pdfPath,
      prefix,
    ];

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
    dpi: number,
    pad: number
  ): Promise<void> {
    const outputPattern = path.join(outputDir, `page-%0${pad}d.png`);
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

  async function runMutoolPage(
    pdfPath: string,
    outputDir: string,
    dpi: number,
    pageNumber: number,
    pad: number
  ): Promise<void> {
    const outputPath = path.join(outputDir, `${getPageBaseName(pageNumber, pad)}.png`);
    const args = [
      "convert",
      "-o",
      outputPath,
      "-r",
      String(dpi),
      pdfPath,
      String(pageNumber),
    ];

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
  async function normaliseNames(outputDir: string, pad: number): Promise<void> {
    const entries = await fs.promises.readdir(outputDir);
    const pageFiles = entries
      .filter((f) => /^page-?\d+\.png$/i.test(f))
      .sort();

    if (pageFiles.length === 0) return;

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

  /** Check whether a rasterization tool is available without throwing. */
  export async function isAvailable(): Promise<boolean> {
    try {
      await detectTool();
      return true;
    } catch {
      return false;
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
    const pageCount = await getPageCount(pdfPath);
    const pad = Math.max(2, String(pageCount).length);
    const pageNumbers = normalisePageNumbers(options.pageNumbers, pageCount);

    if (pageNumbers) {
      if (pageNumbers.length === 0) {
        return;
      }

      if (tool === "pdftoppm") {
        await Promise.all(
          pageNumbers.map((pageNumber) =>
            runPdftoppmPage(pdfPath, outputDir, dpi, pageNumber, pad)
          )
        );
      } else {
        await Promise.all(
          pageNumbers.map((pageNumber) =>
            runMutoolPage(pdfPath, outputDir, dpi, pageNumber, pad)
          )
        );
      }

      return;
    }

    if (tool === "pdftoppm") {
      await runPdftoppm(pdfPath, outputDir, dpi);
      await normaliseNames(outputDir, pad);
      return;
    }

    await runMutool(pdfPath, outputDir, dpi, pad);
  }
}

export { Images };
export type { GenerateOptions, Tool };
