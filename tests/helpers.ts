import fs from "fs";
import path from "path";

export const PROJECT_ROOT = path.resolve(import.meta.dir, "..");

export async function runCli(
  args: string[],
  opts?: { cwd?: string }
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn(["bun", "src/index.ts", ...args], {
    cwd: opts?.cwd ?? PROJECT_ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  const exitCode = await proc.exited;
  return { stdout, stderr, exitCode };
}

export function spawnCli(
  args: string[],
  opts?: { cwd?: string }
): { proc: ReturnType<typeof Bun.spawn>; stdout: Promise<string>; stderr: Promise<string> } {
  const proc = Bun.spawn(["bun", "src/index.ts", ...args], {
    cwd: opts?.cwd ?? PROJECT_ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });
  return {
    proc,
    stdout: new Response(proc.stdout).text(),
    stderr: new Response(proc.stderr).text(),
  };
}

export async function waitForFile(filePath: string, timeoutMs = 10_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(filePath)) return;
    await Bun.sleep(200);
  }
  throw new Error(`Timed out waiting for: ${filePath}`);
}

export async function waitForFileChange(
  filePath: string,
  since: Date,
  timeoutMs = 30_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).mtime > since) return;
    await Bun.sleep(300);
  }
  throw new Error(`File not updated within ${timeoutMs}ms: ${filePath}`);
}

export async function createTestPdf(filePath: string, pageCount = 1): Promise<void> {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) pdf.addPage([612, 792]);
  await fs.promises.writeFile(filePath, await pdf.save());
}
