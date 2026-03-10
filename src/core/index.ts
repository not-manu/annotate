import packageJson from "../../package.json";
import path from "path";

namespace Core {
  export const VERSION = packageJson.version;
  export const NAME = "annotate";
  export const BRAND_COLOR = "0066CC";
  export const DESCRIPTION =
    "A disgustingly simple PDF annotation tool. Supports LaTeX and Typst.";

  export function getPath(): string {
    return process.cwd();
  }

  export function getAbsolutePath(relativePath: string): string {
    return path.resolve(getPath(), relativePath);
  }
}

export { Core };
