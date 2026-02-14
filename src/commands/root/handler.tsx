import type { Command } from "commander";
import { render } from "ink";
import { RootPage } from "./page";
import { Core } from "../../core";

function root(program: Command) {
  program
    .name(Core.NAME)
    .version(Core.VERSION, "-V, --version")
    .description(Core.DESCRIPTION)
    .action(() => {
      render(<RootPage />);
    });
}

export { root };
