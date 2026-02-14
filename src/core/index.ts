import packageJson from "../../package.json";

namespace Core {
  export const VERSION = packageJson.version;
  export const NAME = "annotate";
  export const DESCRIPTION =
    "A disgustingly simple PDF annotation tool. Supports LaTeX and Typst.";
}

export { Core };
