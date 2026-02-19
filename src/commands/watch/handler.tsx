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
    .option("--images", "Generate 300 DPI PNG images in img/ after each compile")
    .action(async (projectDir: string, options: { images?: boolean }) => {
      let resolved = path.resolve(projectDir);

      if (Project.PDF.isPDF(resolved)) {
        resolved = Project.getFolder(resolved);
      }

      if (!Project.isValidProject(resolved)) {
        throw new AnnotateError({
          message: `Not a valid annotate project: ${resolved}`,
          hint: "The directory must contain a pages/ folder with .tex or .typ files.",
        });
      }

      const originalPath = Project.getOriginalPdfPath(resolved);
      if (!path.extname(originalPath)) {
        throw new AnnotateError({
          message: `Could not find the original PDF for project: ${resolved}`,
          hint: "Make sure .annotate/original.pdf exists inside the project folder.",
        });
      }

      const flavor = await Project.detectFlavor(resolved);
      const compiler = await Compiler.detect({ flavor });
      const emitter = new CompilerEmitter();
      const pagesDir = path.join(resolved, "pages");
      const buildDir = path.join(resolved, ".annotate", "build");
      const overlay = {
        originalPath,
        outputPath: Project.getAnnotatedPdfPath(resolved),
      };
      const images = options.images
        ? { outputDir: Project.getImagesFolder(resolved) }
        : undefined;

      await Compiler.compileAll({ compiler, pagesDir, buildDir, emitter, overlay, images });
      const watchHandle = Compiler.watch({ compiler, pagesDir, buildDir, emitter, overlay, images });

      render(<WatchPage emitter={emitter} watchHandle={watchHandle} />);
    });
}

export { watch };
