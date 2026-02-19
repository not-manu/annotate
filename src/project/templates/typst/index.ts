import { generateStyle } from "./style";
import { generatePage } from "./page";

namespace Typst {
  export const generateStyleFile = generateStyle;
  export const generatePageFile = generatePage;
}

export { Typst };
