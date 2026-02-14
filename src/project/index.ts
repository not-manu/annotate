import fs from "fs";
import path from "path";
import { PDF as PDFNamespace } from "./pdf";

namespace Project {
  export import PDF = PDFNamespace;

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
}

export { Project };
