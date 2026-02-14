import type { Command } from "commander";
import { render } from "ink";
import { RootPage } from "./page";
import { Core } from "../../core";
import { Compiler } from "../../compiler";
import { SelectFlavorPage } from "./select-flavor-page";
import { AnnotateError } from "../../error";
import { Project } from "../../project";

function root(program: Command) {
  program
    .name(Core.NAME)
    .version(Core.VERSION, "-V, --version")
    .description(Core.DESCRIPTION)
    .argument("[pdf]", "Path to PDF file to annotate")
    .option("-w, --with [latex|typst]", "Annotate with LaTeX or Typst")
    .action((pdf: string | undefined, options: { with?: string | boolean }) => {
      if (!pdf) {
        render(<RootPage />);
        return;
      }

      if (!Project.PDF.isPDF(pdf)) {
        throw new AnnotateError("The provided file is not a PDF.");
      }

      if (!Project.isFolderEmpty(pdf)) {
        throw new AnnotateError(
          "The folder for this pdf is not empty. Please move or delete the existing files before annotating.",
        );
      }

      if (!Compiler.Flavor.isValid(options.with)) {
        render(<SelectFlavorPage />);
        return;
      }
    });
}

export { root };
