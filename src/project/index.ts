import fs from "fs";
import path from "path";
import { Compiler } from "../compiler";
import { AnnotateError } from "../error";
import { PDF as PDFNamespace } from "./pdf";
import { Templates as TemplatesNamespace } from "./templates";

namespace Project {
  export import PDF = PDFNamespace;
  export import Templates = TemplatesNamespace;

  // ---- Path helpers --------------------------------------------------------

  export function getFolder(pdfPath: string): string {
    const name = PDF.getName(pdfPath);
    return path.join(path.dirname(pdfPath), name);
  }

  export function getPagesFolder(pdfPath: string): string {
    return path.join(getFolder(pdfPath), "pages");
  }

  export function getBuildFolder(pdfPath: string): string {
    return path.join(getFolder(pdfPath), ".annotate", "build");
  }

  export function getOriginalPdfPath(projectDir: string): string {
    return path.join(projectDir, ".annotate", "original.pdf");
  }

  export function getAnnotatedPdfPath(projectDir: string): string {
    const name = path.basename(projectDir);
    return path.join(projectDir, `${name}-annotated.pdf`);
  }

  // ---- Validation & detection ----------------------------------------------

  export function isValidProject(projectDir: string): boolean {
    return fs.existsSync(path.join(projectDir, "pages"));
  }

  export async function detectFlavor(
    projectDir: string
  ): Promise<Compiler.Flavor.Type> {
    const pagesDir = path.join(projectDir, "pages");

    if (!fs.existsSync(pagesDir)) {
      throw new AnnotateError({
        message: `No pages/ folder found in: ${projectDir}`,
        hint: "Make sure this is a valid annotate project directory.",
      });
    }

    const files = await fs.promises.readdir(pagesDir);

    if (files.some((f) => f.endsWith(".tex"))) return "latex";
    if (files.some((f) => f.endsWith(".typ"))) return "typst";

    throw new AnnotateError({
      message: `Could not detect the project flavor in: ${pagesDir}`,
      hint: "The pages/ folder must contain .tex or .typ files.",
    });
  }

  export function isFolderEmpty(pdfPath: string): boolean {
    const folder = getFolder(pdfPath);
    if (!fs.existsSync(folder)) {
      return true;
    }
    return fs.readdirSync(folder).length === 0;
  }

  // ---- Project creation ----------------------------------------------------

  export async function create(
    pdfPath: string,
    flavor: Compiler.Flavor.Type
  ): Promise<void> {
    const pagesFolder = getPagesFolder(pdfPath);
    const buildFolder = getBuildFolder(pdfPath);

    await fs.promises.mkdir(pagesFolder, { recursive: true });
    await fs.promises.mkdir(buildFolder, { recursive: true });

    // Keep a copy of the original PDF inside the project so overlay works
    // even if the original file is moved.
    const originalDest = getOriginalPdfPath(getFolder(pdfPath));
    await fs.promises.copyFile(path.resolve(pdfPath), originalDest);

    if (flavor === "latex") {
      const dimensions = await PDF.getAllPageDimensions(pdfPath);
      const pad = Math.max(2, String(dimensions.length).length);

      await fs.promises.writeFile(
        path.join(pagesFolder, "style.sty"),
        Templates.LaTeX.generateStyleFile()
      );

      for (let index = 0; index < dimensions.length; index += 1) {
        const pageNumber = index + 1;
        const name = `page-${String(pageNumber).padStart(pad, "0")}.tex`;
        const dims = dimensions[index];

        if (!dims) {
          throw new AnnotateError({
            message: `Missing page dimensions for page ${pageNumber}.`,
            hint: "Check that the PDF is readable and not corrupted.",
          });
        }

        const content = Templates.LaTeX.generatePageFile({
          pageNumber,
          width: dims.width,
          height: dims.height,
        });

        await fs.promises.writeFile(path.join(pagesFolder, name), content);
      }

      return;
    }

    throw new AnnotateError({
      message: `The ${flavor} template is not implemented yet.`,
      hint: "Use --with latex for now.",
    });
  }
}

export { Project };
