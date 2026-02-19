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
    .option("--images", "Generate 300 DPI PNG images in img/ after each compile")
    .action(async (pdf: string | undefined, options: { with?: string | boolean; images?: boolean }) => {
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

      const projectDir = Project.getFolder(pdf);

      if (!Project.isFolderEmpty(pdf)) {
        if (!Project.isValidProject(projectDir)) {
          throw new AnnotateError({
            message: `The annotation folder for this PDF is not empty: ${projectDir}`,
            hint: "Move or delete the existing files in this folder before annotating.",
          });
        }

        // Valid existing project — skip creation and go straight to watch mode.
        const flavor = await Project.detectFlavor(projectDir);
        const compiler = await Compiler.detect({ flavor });
        const emitter = new CompilerEmitter();
        const pagesDir = Project.getPagesFolder(pdf);
        const buildDir = Project.getBuildFolder(pdf);
        const overlay = {
          originalPath: Project.getOriginalPdfPath(projectDir),
          outputPath: Project.getAnnotatedPdfPath(projectDir),
        };
        const images = options.images
          ? { outputDir: Project.getImagesFolder(projectDir) }
          : undefined;

        await Compiler.compileAll({ compiler, pagesDir, buildDir, emitter, overlay, images });
        const watchHandle = Compiler.watch({ compiler, pagesDir, buildDir, emitter, overlay, images });

        render(<WatchPage emitter={emitter} watchHandle={watchHandle} />);
        return;
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
      const overlay = {
        originalPath: Project.getOriginalPdfPath(projectDir),
        outputPath: Project.getAnnotatedPdfPath(projectDir),
      };
      const images = options.images
        ? { outputDir: Project.getImagesFolder(projectDir) }
        : undefined;

      await Compiler.compileAll({ compiler, pagesDir, buildDir, emitter, overlay, images });
      const watchHandle = Compiler.watch({ compiler, pagesDir, buildDir, emitter, overlay, images });

      render(<WatchPage emitter={emitter} watchHandle={watchHandle} />);
    });
}

export { root };
