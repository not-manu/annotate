import fs from "fs";
import { Core } from "../../core";
import { AnnotateError } from "../../error";

namespace PDF {
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
}

export { PDF };
