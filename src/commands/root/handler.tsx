import type { Command } from "commander";
import { render } from "ink";
import { RootPage } from "./page";
import { Core } from "../../core";

function root(program: Command) {
  program
    .name(Core.NAME)
    .version(Core.VERSION, "-V, --version")
    .description(Core.DESCRIPTION)
    .argument("[pdf]", "Path to PDF file to annotate")
    .option("-w, --with [latex|typst]", "Annotate with LaTeX or Typst")
    .action((pdf: string | undefined, options: { with?: string | boolean }) => {
      render(<RootPage />);
    });
}

export { root };
