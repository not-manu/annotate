import { CompilerBase } from "./base";

/** Shared base for all LaTeX compilers (latexmk, pdflatex, xelatex, tectonic). */
abstract class LatexCompilerBase extends CompilerBase {
  readonly sourceExtension = ".tex";
  readonly styleExtensions = [".sty"];
}

export { LatexCompilerBase };
