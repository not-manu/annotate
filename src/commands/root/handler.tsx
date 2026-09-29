import type { Command } from "commander";
import { render } from "ink";
import { RootPage } from "./page";
import { Core } from "../../core";
import { Compiler } from "../../compiler";
import { AnnotateError } from "../../error";
import { Project } from "../../project";
import { Session } from "../session";

type RootOptions = {
  with?: string | boolean;
  images?: boolean;
  agents?: boolean;
  once?: boolean;
};

function root(program: Command) {
  program
    .name(Core.NAME)
    .version(Core.VERSION, "-V, --version")
    .description(Core.DESCRIPTION)
    .argument("[pdf]", "Path to PDF file to annotate")
    .option("-w, --with [latex|typst]", "Annotate with LaTeX or Typst")
    .option("--images", "Generate 300 DPI PNG images in img/ after each compile")
    .option("--agents", "Generate AGENTS.md and CLAUDE.md, and enable --images for AI agent workflows")
    .option("--once", "Compile every page once, print the results, and exit (no watch, no UI)")
    .action(async (pdf: string | undefined, options: RootOptions) => {
      if (options.agents) options.images = true;

      if (!pdf) {
        render(<RootPage />);
        return;
      }

      if (!Project.PDF.isPDF(pdf)) {
        throw new AnnotateError({
          message: `'${pdf}' does not exist or is not a PDF.`,
          hint: "Make sure the file exists and has a .pdf extension.",
        });
      }

      const projectDir = Project.getFolder(pdf);
      let flavor: Compiler.Flavor.Type;

      if (Project.isFolderEmpty(pdf)) {
        if (!Compiler.Flavor.isValid(options.with)) {
          throw new AnnotateError({
            message: "No language specified. Use --with latex or --with typst.",
            hint: "Use --with latex or --with typst.",
          });
        }
        flavor = options.with as Compiler.Flavor.Type;
        await Compiler.detect({ flavor });
        await Project.create(pdf, flavor, { agents: options.agents });
      } else {
        if (!Project.isValidProject(projectDir)) {
          throw new AnnotateError({
            message: `The folder '${projectDir}' already exists and is not an annotate project.`,
            hint: "Move or delete the existing files in this folder before annotating.",
          });
        }
        if (options.agents) await Project.writeAgentFiles(projectDir);
        flavor = await Project.detectFlavor(projectDir);
      }

      const compiler = await Compiler.detect({ flavor });
      await Session.start({
        projectDir,
        compiler,
        flavor,
        images: options.images,
        once: options.once,
      });
    });
}

export { root };
