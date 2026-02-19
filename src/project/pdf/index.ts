import fs from "fs";
import { PDFDocument } from "pdf-lib";
import { Core } from "../../core";
import { AnnotateError } from "../../error";

namespace PDF {
  async function load(path: string): Promise<PDFDocument> {
    const absolutePath = Core.getAbsolutePath(path);
    const bytes = await fs.promises.readFile(absolutePath);
    return PDFDocument.load(bytes);
  }

  export function getName(path: string): string {
    if (!isPDF(path)) {
      throw new AnnotateError({
        message: `The provided file is not a PDF: ${path}`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const name = path.split("/").pop()!.split(".pdf")[0];

    if (!name) {
      throw new AnnotateError({
        message: `The provided file does not have a valid name: ${path}`,
        hint: "The filename before .pdf must not be empty.",
      });
    }

    return name;
  }

  export function isPDF(path: string): boolean {
    try {
      return (
        fs.existsSync(Core.getAbsolutePath(path)) &&
        path.toLowerCase().endsWith(".pdf")
      );
    } catch {
      return false;
    }
  }

  export async function getPageCount(path: string): Promise<number> {
    if (!isPDF(path)) {
      throw new AnnotateError({
        message: `The provided file is not a PDF: ${path}`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const pdf = await load(path);
    return pdf.getPageCount();
  }

  export async function getPageDimensions(
    path: string,
    pageIndex: number
  ): Promise<{ width: number; height: number }> {
    if (!isPDF(path)) {
      throw new AnnotateError({
        message: `The provided file is not a PDF: ${path}`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const pdf = await load(path);
    const pageCount = pdf.getPageCount();

    if (pageIndex < 0 || pageIndex >= pageCount) {
      throw new AnnotateError({
        message: `The page index is out of bounds: ${pageIndex}`,
        hint: `This PDF has ${pageCount} pages.`,
      });
    }

    const page = pdf.getPages()[pageIndex];
    if (!page) {
      throw new AnnotateError({
        message: `The page index is out of bounds: ${pageIndex}`,
        hint: `This PDF has ${pageCount} pages.`,
      });
    }

    const { width, height } = page.getSize();
    return { width, height };
  }

  export async function getAllPageDimensions(
    path: string
  ): Promise<Array<{ width: number; height: number }>> {
    if (!isPDF(path)) {
      throw new AnnotateError({
        message: `The provided file is not a PDF: ${path}`,
        hint: "Make sure the file exists and has a .pdf extension.",
      });
    }

    const pdf = await load(path);
    return pdf.getPages().map((page) => page.getSize());
  }
}

export { PDF };
