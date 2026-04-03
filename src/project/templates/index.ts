import { LaTeX as LaTeXNamespace } from "./latex";
import { Typst as TypstNamespace } from "./typst";
import { Agents as AgentsNamespace } from "./agents";

namespace Templates {
  export import LaTeX = LaTeXNamespace;
  export import Typst = TypstNamespace;
  export import Agents = AgentsNamespace;
}

export { Templates };
