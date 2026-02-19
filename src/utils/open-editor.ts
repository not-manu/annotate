import { spawn } from "child_process";

// Terminal editors that need a terminal emulator window
const TERMINAL_EDITORS = [
  "nvim",
  "vim",
  "vi",
  "nano",
  "emacs",
  "hx",
  "micro",
  "helix",
];

// GUI editors that can be launched directly
const GUI_EDITORS = [
  "code",
  "cursor",
  "subl",
  "zed",
  "atom",
  "mate",
  "bbedit",
  "nova",
];

// Terminal emulators to check, in preference order
const TERMINAL_EMULATORS = [
  { name: "ghostty", args: (cmd: string[]) => ["-e", ...cmd] },
  { name: "kitty", args: (cmd: string[]) => ["--", ...cmd] },
  { name: "wezterm", args: (cmd: string[]) => ["start", "--", ...cmd] },
  { name: "alacritty", args: (cmd: string[]) => ["-e", ...cmd] },
  { name: "foot", args: (cmd: string[]) => ["-e", ...cmd] },
  { name: "hyper", args: (cmd: string[]) => ["-e", ...cmd] },
];

namespace OpenEditor {
  function isTerminalEditor(editor: string): boolean {
    const bin = editor.split("/").pop() ?? editor;
    return TERMINAL_EDITORS.some((e) => bin.startsWith(e));
  }

  function isGuiEditor(editor: string): boolean {
    const bin = editor.split("/").pop() ?? editor;
    return GUI_EDITORS.some((e) => bin.startsWith(e));
  }

  function spawnDetached(cmd: string, args: string[]): void {
    const child = spawn(cmd, args, {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  }

  async function findTerminalEmulator(): Promise<
    { name: string; args: (cmd: string[]) => string[] } | undefined
  > {
    const { execFile } = await import("child_process");
    const { promisify } = await import("util");
    const execFileAsync = promisify(execFile);

    for (const terminal of TERMINAL_EMULATORS) {
      try {
        await execFileAsync("which", [terminal.name]);
        return terminal;
      } catch {
        // not found, try next
      }
    }
    return undefined;
  }

  export async function open(filePath: string): Promise<void> {
    const editor = process.env.VISUAL ?? process.env.EDITOR;

    // No editor configured — fall back to OS default
    if (!editor) {
      spawnDetached("open", [filePath]);
      return;
    }

    // GUI editors launch directly
    if (isGuiEditor(editor)) {
      spawnDetached(editor, [filePath]);
      return;
    }

    // Terminal editors need a terminal window
    if (isTerminalEditor(editor)) {
      const terminal = await findTerminalEmulator();
      if (terminal) {
        spawnDetached(terminal.name, terminal.args([editor, filePath]));
        return;
      }
      // No terminal emulator found — try iTerm2 via AppleScript on macOS
      if (process.platform === "darwin") {
        const script = `tell application "iTerm2" to create window with default profile command "${editor} ${filePath}"`;
        spawnDetached("osascript", ["-e", script]);
        return;
      }
    }

    // Unrecognised editor — attempt direct launch as GUI, then OS fallback
    spawnDetached(editor, [filePath]);
  }
}

export { OpenEditor };
