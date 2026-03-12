import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { Core } from "../core";
import { AnnotateError } from "../error";

type OverlayOptions = {
  originalPath: string;
  buildDir: string;
  outputPath: string;
};

namespace PDF {
  async function load(filePath: string): Promise<PDFDocument> {
    const absolutePath = Core.getAbsolutePath(filePath);
    const bytes = await fs.promises.readFile(absolutePath);
    return PDFDocument.load(bytes);
  }

  export function getName(filePath: string): string {
    if (!isPDF(filePath)) {
      throw new AnnotateError({
        message: `Cannot read PDF name: '${filePath}' does not exist or is not a PDF.`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const name = filePath.split("/").pop()!.split(".pdf")[0];

    if (!name) {
      throw new AnnotateError({
        message: `The PDF filename is empty or invalid: '${filePath}'.`,
        hint: "The filename before .pdf must not be empty.",
      });
    }

    return name;
  }

  export function isPDF(filePath: string): boolean {
    try {
      return (
        fs.existsSync(Core.getAbsolutePath(filePath)) &&
        filePath.toLowerCase().endsWith(".pdf")
      );
    } catch {
      return false;
    }
  }

  export async function getPageCount(filePath: string): Promise<number> {
    if (!isPDF(filePath)) {
      throw new AnnotateError({
        message: `Cannot read page count: '${filePath}' does not exist or is not a PDF.`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const pdf = await load(filePath);
    return pdf.getPageCount();
  }

  export async function getPageDimensions(
    filePath: string,
    pageIndex: number
  ): Promise<{ width: number; height: number }> {
    if (!isPDF(filePath)) {
      throw new AnnotateError({
        message: `Cannot read page dimensions: '${filePath}' does not exist or is not a PDF.`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const pdf = await load(filePath);
    const pageCount = pdf.getPageCount();

    if (pageIndex < 0 || pageIndex >= pageCount) {
      throw new AnnotateError({
        message: `Page ${pageIndex + 1} does not exist in this PDF.`,
        hint: `This PDF only has ${pageCount} page(s).`,
      });
    }

    const page = pdf.getPages()[pageIndex];
    if (!page) {
      throw new AnnotateError({
        message: `Page ${pageIndex + 1} could not be read from this PDF.`,
        hint: `This PDF only has ${pageCount} page(s).`,
      });
    }

    const { width, height } = page.getSize();
    return { width, height };
  }

  export async function getAllPageDimensions(
    filePath: string
  ): Promise<Array<{ width: number; height: number }>> {
    if (!isPDF(filePath)) {
      throw new AnnotateError({
        message: `Cannot read page dimensions: '${filePath}' does not exist or is not a PDF.`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const pdf = await load(filePath);
    return pdf.getPages().map((page) => page.getSize());
  }

  export async function overlay(options: OverlayOptions): Promise<void> {
    const originalBytes = await fs.promises.readFile(options.originalPath);
    const original = await PDFDocument.load(originalBytes);
    const output = await PDFDocument.create();

    const pageCount = original.getPageCount();
    const pad = Math.max(2, String(pageCount).length);

    // Copy all original pages into the output document first
    const copiedPageIndices = original.getPages().map((_, i) => i);
    const copiedPages = await output.copyPages(original, copiedPageIndices);
    for (const page of copiedPages) {
      output.addPage(page);
    }

    // Overlay each compiled page PDF on top of the corresponding original page.
    // Missing build pages are silently skipped — original shows through.
    const overlayTasks = Array.from({ length: pageCount }, async (_, i) => {
      const pageNumber = i + 1;
      const name = `page-${String(pageNumber).padStart(pad, "0")}.pdf`;
      const buildPath = path.join(options.buildDir, name);

      if (!fs.existsSync(buildPath)) return;

      const overlayBytes = await fs.promises.readFile(buildPath);
      const overlayDoc = await PDFDocument.load(overlayBytes);
      const overlayPages = overlayDoc.getPages();
      if (overlayPages.length === 0) return;

      const [embedded] = await output.embedPages(overlayPages);
      if (!embedded) return;

      const outputPage = output.getPage(i);
      outputPage.drawPage(embedded, { x: 0, y: 0 });
    });

    await Promise.all(overlayTasks);

    const outputBytes = await output.save();
    await fs.promises.writeFile(options.outputPath, outputBytes);
  }
}

export { PDF };
export type { OverlayOptions };
