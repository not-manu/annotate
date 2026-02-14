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
        throw new AnnotateError({
          message: `The provided file is not a PDF: ${pdf}`,
          hint: "Make sure the file exists and has a .pdf extension.",
        });
      }

      if (!Project.isFolderEmpty(pdf)) {
        const folder = Project.getFolder(pdf);
        throw new AnnotateError({
          message: `The annotation folder for this PDF is not empty: ${folder}`,
          hint: "Move or delete the existing files in this folder before annotating.",
        });
      }

      if (!Compiler.Flavor.isValid(options.with)) {
        render(<SelectFlavorPage />);
        return;
      }
    });
}

export { root };
