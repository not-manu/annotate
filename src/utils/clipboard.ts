import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

namespace Clipboard {
  function getCopyCommand(): string | null {
    if (process.platform === "darwin") return "pbcopy";
    if (process.env.DISPLAY || process.env.WAYLAND_DISPLAY) {
      return "xclip -selection clipboard";
    }
    return null;
  }

  export async function copyFile(filePath: string): Promise<void> {
    const cmd = getCopyCommand();
    if (!cmd) throw new Error("No clipboard command available on this platform");

    const contents = await fs.readFile(filePath, "utf-8");
    await execAsync(cmd, { input: contents } as Parameters<typeof execAsync>[1]);
  }
}

export { Clipboard };
