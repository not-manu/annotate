import fs from "fs";
import path from "path";
import type { Command } from "commander";
import { Compiler } from "../../compiler";
import { AnnotateError } from "../../error";
import { Project } from "../../project";
import { Session } from "../session";

type WatchOptions = {
  images?: boolean;
  agents?: boolean;
  once?: boolean;
};

function resolveProject(projectDir: string): string {
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

  return resolved;
}

function watch(program: Command) {
  program
    .command("watch <projects...>")
    .description("Watch and compile annotation pages in an existing project (several with --once)")
    .option("--images", "Generate 300 DPI PNG images in img/ after each compile (implied when img/ already exists)")
    .option("--agents", "Generate AGENTS.md and enable --images for AI agent workflows")
    .option("--once", "Compile every page once, print the results, and exit (no watch, no UI)")
    .action(async (projectDirs: string[], options: WatchOptions, command: Command) => {
      const parent: WatchOptions = command.parent?.opts() ?? {};
      const agents = options.agents || parent.agents;
      const once = options.once || parent.once;

      if (projectDirs.length > 1 && !once) {
        throw new AnnotateError({
          message: "Watching several projects at once is not supported.",
          hint: "Pass --once to build each project once, or watch one project at a time.",
        });
      }

      const projects = projectDirs.map(resolveProject);

      for (const resolved of projects) {
        if (projects.length > 1) console.log(`▸ ${resolved}`);

        if (agents) await Project.writeAgentFiles(resolved);

        const images =
          options.images ||
          parent.images ||
          agents ||
          fs.existsSync(Project.getImagesFolder(resolved));

        const flavor = await Project.detectFlavor(resolved);
        const compiler = await Compiler.detect({ flavor });
        await Session.start({ projectDir: resolved, compiler, flavor, images, once });
      }
    });
}

export { watch };
