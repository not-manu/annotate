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

  export function getImagesFolder(projectDir: string): string {
    return path.join(projectDir, "img");
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
        message: `'${projectDir}' is not a valid annotate project — no pages/ folder found.`,
        hint: "Make sure this is a valid annotate project directory.",
      });
    }

    const files = await fs.promises.readdir(pagesDir);

    if (files.some((f) => f.endsWith(".tex"))) return "latex";
    if (files.some((f) => f.endsWith(".typ"))) return "typst";

    throw new AnnotateError({
      message: `Could not determine project type: no .tex or .typ files found in pages/.`,
      hint: "The pages/ folder must contain .tex or .typ files.",
    });
  }

  export function isFolderEmpty(pdfPath: string): boolean {
    const folder = getFolder(pdfPath);
    if (!fs.existsSync(folder)) return true;
    return fs.readdirSync(folder).length === 0;
  }

  // ---- Project creation ----------------------------------------------------

  export async function create(
    pdfPath: string,
    flavor: Compiler.Flavor.Type,
    options?: { agents?: boolean }
  ): Promise<void> {
    const pagesFolder = getPagesFolder(pdfPath);
    const buildFolder = getBuildFolder(pdfPath);

    await fs.promises.mkdir(pagesFolder, { recursive: true });
    await fs.promises.mkdir(buildFolder, { recursive: true });

    // Keep a copy of the original PDF inside the project so overlay works
    // even if the original file is moved.
    const originalDest = getOriginalPdfPath(getFolder(pdfPath));
    await fs.promises.copyFile(path.resolve(pdfPath), originalDest);

    const dimensions = await PDF.getAllPageDimensions(pdfPath);
    const pad = Math.max(2, String(dimensions.length).length);
    const isLatex = flavor === "latex";
    const ext = isLatex ? ".tex" : ".typ";
    const styleFile = isLatex ? "style.sty" : "style.typ";
    const generateStyle = isLatex
      ? Templates.LaTeX.generateStyleFile
      : Templates.Typst.generateStyleFile;
    const generatePage = isLatex
      ? Templates.LaTeX.generatePageFile
      : Templates.Typst.generatePageFile;

    await fs.promises.writeFile(path.join(pagesFolder, styleFile), generateStyle());

    for (let index = 0; index < dimensions.length; index += 1) {
      const pageNumber = index + 1;
      const name = `page-${String(pageNumber).padStart(pad, "0")}${ext}`;
      const dims = dimensions[index];

      if (!dims) {
        throw new AnnotateError({
          message: `Could not read dimensions for page ${pageNumber} of the PDF.`,
          hint: "Check that the PDF is not corrupted or password-protected.",
        });
      }

      await fs.promises.writeFile(
        path.join(pagesFolder, name),
        generatePage({ pageNumber, width: dims.width, height: dims.height })
      );
    }

    if (options?.agents) {
      const projectDir = getFolder(pdfPath);
      await fs.promises.writeFile(
        path.join(projectDir, "AGENTS.md"),
        Templates.Agents.generateAgentsMd()
      );
      await fs.promises.writeFile(
        path.join(projectDir, "CLAUDE.md"),
        Templates.Agents.generateClaudeMd()
      );
    }
  }
}

export { Project };
