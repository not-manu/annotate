import path from "path";
import type { CompilerEmitter } from "../compiler";

namespace Headless {
  export function attach(emitter: CompilerEmitter): Set<string> {
    const started = new Map<string, number>();
    const failed = new Set<string>();

    emitter.on("compile:start", ({ inputPath }) => {
      started.set(inputPath, Date.now());
    });

    emitter.on("compile:end", (result) => {
      const name = path.parse(result.inputPath).name;
      const elapsed = Date.now() - (started.get(result.inputPath) ?? Date.now());
      if (result.success) {
        failed.delete(name);
        console.log(`✓ ${name} ${elapsed}ms`);
      } else {
        failed.add(name);
        console.log(`✗ ${name} ${elapsed}ms  see ${result.errorLogPath}`);
      }
    });

    emitter.on("overlay:end", ({ outputPath, success }) => {
      console.log(success ? `→ ${outputPath}` : `✗ overlay failed: ${outputPath}`);
    });

    emitter.on("images:end", ({ success }) => {
      if (!success) console.log("✗ image generation failed");
    });

    return failed;
  }
}

export { Headless };
