import fs from "fs";
import path from "path";
import { Compiler } from "../compiler";
import { AnnotateError } from "../error";
import { PDF as PDFNamespace } from "./pdf";
import { Templates as TemplatesNamespace } from "./templates";

namespace Project {
  export import PDF = PDFNamespace;
  export import Templates = TemplatesNamespace;

  export function getFolder(pdfPath: string): string {
    const name = PDF.getName(pdfPath);
    return path.join(path.dirname(pdfPath), name);
  }

  export function isFolderEmpty(pdfPath: string): boolean {
    const folder = getFolder(pdfPath);
    if (!fs.existsSync(folder)) {
      return true;
    }
    return fs.readdirSync(folder).length === 0;
  }

  export async function create(
    pdfPath: string,
    flavor: Compiler.Flavor.Type
  ): Promise<void> {
    const folder = getFolder(pdfPath);
    const pagesFolder = path.join(folder, "pages");

    await fs.promises.mkdir(pagesFolder, { recursive: true });

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
