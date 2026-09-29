import path from "path";
import { render } from "ink";
import { Compiler, CompilerEmitter } from "../compiler";
import type { CompilerBase } from "../compiler/base";
import type { WatchHandle } from "../compiler";
import { Project } from "../project";
import { Headless } from "./headless";
import { WatchPage } from "./watch/page";

type SessionOptions = {
  projectDir: string;
  compiler: CompilerBase;
  flavor: Compiler.Flavor.Type;
  images?: boolean;
  once?: boolean;
};

namespace Session {
  export function isInteractive(): boolean {
    return Boolean(process.stdin.isTTY && process.stdout.isTTY);
  }

  export async function start(options: SessionOptions): Promise<void> {
    const emitter = new CompilerEmitter();
    const compile = {
      compiler: options.compiler,
      emitter,
      pagesDir: path.join(options.projectDir, "pages"),
      buildDir: path.join(options.projectDir, ".annotate", "build"),
      overlay: {
        originalPath: Project.getOriginalPdfPath(options.projectDir),
        outputPath: Project.getAnnotatedPdfPath(options.projectDir),
      },
      images: options.images
        ? { outputDir: Project.getImagesFolder(options.projectDir) }
        : undefined,
    };

    if (!options.once && isInteractive()) {
      const watchRef: { current: WatchHandle | null } = { current: null };
      render(
        <WatchPage
          emitter={emitter}
          watchRef={watchRef}
          flavor={options.flavor}
          compilerName={options.compiler.name}
          images={!!options.images}
        />
      );
      await Compiler.compileAll(compile);
      watchRef.current = Compiler.watch(compile);
      return;
    }

    const failed = Headless.attach(emitter);
    await Compiler.compileAll(compile);

    if (options.once) {
      process.exitCode = failed.size > 0 ? 1 : 0;
      return;
    }

    const watcher = Compiler.watch(compile);
    const stop = () => {
      watcher.stop();
      process.exit(0);
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  }
}

export { Session };
export type { SessionOptions };
