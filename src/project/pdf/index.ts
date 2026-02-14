import fs from "fs";
import { Core } from "../../core";
import { AnnotateError } from "../../error";

namespace PDF {
  export function getName(path: string): string {
    if (!isPDF(path)) {
      throw new AnnotateError("The provided file is not a PDF.");
    }

    const name = path.split("/").pop()!.split(".pdf")[0];

    if (!name) {
      throw new AnnotateError("The provided file does not have a valid name.");
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
