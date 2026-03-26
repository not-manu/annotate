import packageJson from "../../package.json";
import path from "path";

namespace Core {
  export const VERSION = packageJson.version;
  export const NAME = "annotate";
  export const BRAND_COLOR = "0000FF";
  export const DESCRIPTION = "Annotate your PDFs with LaTeX & Typst!";

  export function getPath(): string {
    return process.cwd();
  }

  export function getAbsolutePath(relativePath: string): string {
    return path.resolve(getPath(), relativePath);
  }
}

export { Core };
