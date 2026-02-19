import { LaTeX as LaTeXNamespace } from "./latex";
import { Typst as TypstNamespace } from "./typst";

namespace Templates {
  export import LaTeX = LaTeXNamespace;
  export import Typst = TypstNamespace;
}

export { Templates };
