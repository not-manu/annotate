import path from "path";
import type { Command } from "commander";
import { render } from "ink";
import { Compiler, CompilerEmitter } from "../../compiler";
import type { WatchHandle } from "../../compiler";
import { AnnotateError } from "../../error";
import { Project } from "../../project";
import { WatchPage } from "./page";

function watch(program: Command) {
  program
    .command("watch <project>")
    .description("Watch and compile annotation pages in an existing project")
    .option("--images", "Generate 300 DPI PNG images in img/ after each compile")
    .action(async (projectDir: string, options: { images?: boolean }, command: Command) => {
      let resolved = path.resolve(projectDir);

      if (Project.PDF.isPDF(resolved)) {
        resolved = Project.getFolder(resolved);
      }

      if (!Project.isValidProject(resolved)) {
        throw new AnnotateError({
          message: `'${resolved}' is not a valid annotate project.`,
          hint: "The directory must contain a pages/ folder with .tex or .typ files.",
        });
      }

      const originalPath = Project.getOriginalPdfPath(resolved);
      if (!path.extname(originalPath)) {
        throw new AnnotateError({
          message: `Original PDF not found for project '${resolved}'.`,
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
      const imagesFlag = options.images || command.parent?.opts()?.images;
      const images = imagesFlag
        ? { outputDir: Project.getImagesFolder(resolved) }
        : undefined;

      const watchRef: { current: WatchHandle | null } = { current: null };
      render(
        <WatchPage
          emitter={emitter}
          watchRef={watchRef}
          flavor={flavor}
          compilerName={compiler.name}
          images={!!imagesFlag}
        />
      );

      await Compiler.compileAll({ compiler, pagesDir, buildDir, emitter, overlay, images });
      watchRef.current = Compiler.watch({ compiler, pagesDir, buildDir, emitter, overlay, images });
    });
}

export { watch };
