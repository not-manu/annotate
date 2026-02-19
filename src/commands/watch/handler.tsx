import path from "path";
import type { Command } from "commander";
import { render } from "ink";
import { Compiler, CompilerEmitter } from "../../compiler";
import { AnnotateError } from "../../error";
import { Project } from "../../project";
import { WatchPage } from "./page";

function watch(program: Command) {
  program
    .command("watch <project>")
    .description("Watch and compile annotation pages in an existing project")
    .action(async (projectDir: string) => {
      const resolved = path.resolve(projectDir);

      if (!Project.isValidProject(resolved)) {
        throw new AnnotateError({
          message: `Not a valid annotate project: ${resolved}`,
          hint: "The directory must contain a pages/ folder with .tex or .typ files.",
        });
      }

      const flavor = await Project.detectFlavor(resolved);
      const compiler = await Compiler.detect({ flavor });
      const emitter = new CompilerEmitter();
      const pagesDir = path.join(resolved, "pages");
      const buildDir = path.join(resolved, ".annotate", "build");

      render(<WatchPage emitter={emitter} />);

      await Compiler.compileAll({ compiler, pagesDir, buildDir, emitter });
      Compiler.watch({ compiler, pagesDir, buildDir, emitter });
    });
}

export { watch };
