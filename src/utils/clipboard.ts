import fs from "fs/promises";
import { spawn } from "child_process";

namespace Clipboard {
  function getCopyArgs(): { bin: string; args: string[] } | null {
    if (process.platform === "darwin") {
      return { bin: "pbcopy", args: [] };
    }
    if (process.env.DISPLAY || process.env.WAYLAND_DISPLAY) {
      return { bin: "xclip", args: ["-selection", "clipboard"] };
    }
    return null;
  }

  export async function copyFile(filePath: string): Promise<void> {
    const copyCmd = getCopyArgs();
    if (!copyCmd) {
      throw new Error("No clipboard command available on this platform");
    }

    const contents = await fs.readFile(filePath, "utf-8");

    await new Promise<void>((resolve, reject) => {
      const child = spawn(copyCmd.bin, copyCmd.args, {
        stdio: ["pipe", "ignore", "ignore"],
      });

      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`${copyCmd.bin} exited with code ${code}`));
      });

      // Write contents to stdin and close it so pbcopy/xclip knows it's done
      (child.stdin as NodeJS.WritableStream).write(contents, "utf-8", () => {
        (child.stdin as NodeJS.WritableStream).end();
      });
    });
  }
}

export { Clipboard };
