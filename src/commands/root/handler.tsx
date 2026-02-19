import type { Command } from "commander";
import { render } from "ink";
import { RootPage } from "./page";
import { WatchPage } from "../watch/page";
import { Core } from "../../core";
import { Compiler, CompilerEmitter } from "../../compiler";
import { AnnotateError } from "../../error";
import { Project } from "../../project";

function root(program: Command) {
  program
    .name(Core.NAME)
    .version(Core.VERSION, "-V, --version")
    .description(Core.DESCRIPTION)
    .argument("[pdf]", "Path to PDF file to annotate")
    .option("-w, --with [latex|typst]", "Annotate with LaTeX or Typst")
    .action(async (pdf: string | undefined, options: { with?: string | boolean }) => {
      if (!pdf) {
        render(<RootPage />);
        return;
      }

      if (!Project.PDF.isPDF(pdf)) {
        throw new AnnotateError({
          message: `The provided file is not a PDF: ${pdf}`,
          hint: "Make sure the file exists and has a .pdf extension.",
        });
      }

      if (!Project.isFolderEmpty(pdf)) {
        throw new AnnotateError({
          message: `The annotation folder for this PDF is not empty: ${Project.getFolder(pdf)}`,
          hint: "Move or delete the existing files in this folder before annotating.",
        });
      }

      if (!Compiler.Flavor.isValid(options.with)) {
        throw new AnnotateError({
          message: "A valid language must be specified.",
          hint: "Use --with latex or --with typst.",
        });
      }

      const flavor = options.with as Compiler.Flavor.Type;
      const compiler = await Compiler.detect({ flavor });

      await Project.create(pdf, flavor);

      const emitter = new CompilerEmitter();
      const pagesDir = Project.getPagesFolder(pdf);
      const buildDir = Project.getBuildFolder(pdf);

      render(<WatchPage emitter={emitter} />);

      await Compiler.compileAll({ compiler, pagesDir, buildDir, emitter });
      Compiler.watch({ compiler, pagesDir, buildDir, emitter });
    });
}

export { root };
