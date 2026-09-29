import { describe, it, expect, beforeAll, beforeEach, afterEach } from "bun:test";
import fs from "fs";
import path from "path";
import os from "os";
import { runCli, spawnCli, createTestPdf, waitForFile } from "./helpers";

let availableFlavor: "latex" | "typst" | null = null;

beforeAll(async () => {
  const typst = Bun.spawn(["typst", "--version"], { stdout: "ignore", stderr: "ignore" });
  if ((await typst.exited) === 0) {
    availableFlavor = "typst";
    return;
  }
  for (const cmd of ["tectonic", "latexmk", "pdflatex", "xelatex"]) {
    const proc = Bun.spawn([cmd, "--version"], { stdout: "ignore", stderr: "ignore" });
    if ((await proc.exited) === 0) {
      availableFlavor = "latex";
      return;
    }
  }
});

describe("CLI headless mode", () => {
  let tmpDir: string;
  let pdfPath: string;
  let projectDir: string;
  let outputPdf: string;

  beforeEach(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "annotate-headless-test-"));
    pdfPath = path.join(tmpDir, "lecture.pdf");
    projectDir = path.join(tmpDir, "lecture");
    outputPdf = path.join(projectDir, "lecture-annotated.pdf");
    await createTestPdf(pdfPath, 2);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("--once creates the project, compiles every page, and exits 0", async () => {
    if (!availableFlavor) {
      console.log("Skipping: no compiler installed");
      return;
    }

    const { stdout, exitCode } = await runCli([pdfPath, "--with", availableFlavor, "--once"]);

    expect(exitCode).toBe(0);
    expect(fs.existsSync(outputPdf)).toBe(true);
    expect(stdout).toContain("✓ page-01");
    expect(stdout).toContain("✓ page-02");
  }, 60_000);

  it("watch --once exits 1 when a page fails to compile", async () => {
    if (!availableFlavor) {
      console.log("Skipping: no compiler installed");
      return;
    }

    await runCli([pdfPath, "--with", availableFlavor, "--once"]);
    const ext = availableFlavor === "typst" ? ".typ" : ".tex";
    const broken = availableFlavor === "typst"
      ? '#panic("broken page")'
      : "\\documentclass{article}\\begin{document}\\undefinedmacro\\end{document}";
    fs.writeFileSync(path.join(projectDir, "pages", `page-01${ext}`), broken);

    const { stdout, exitCode } = await runCli(["watch", projectDir, "--once"]);

    expect(exitCode).toBe(1);
    expect(stdout).toContain("✗ page-01");
    expect(stdout).toContain("✓ page-02");
  }, 90_000);

  it("watch --once regenerates img/ when the project already has one", async () => {
    if (!availableFlavor) {
      console.log("Skipping: no compiler installed");
      return;
    }
    const pdftoppm = Bun.spawn(["pdftoppm", "-v"], { stdout: "ignore", stderr: "ignore" });
    if ((await pdftoppm.exited) > 1) {
      console.log("Skipping: pdftoppm not installed");
      return;
    }

    await runCli([pdfPath, "--with", availableFlavor, "--agents", "--once"]);
    const image = path.join(projectDir, "img", "page-01.png");
    expect(fs.existsSync(image)).toBe(true);
    const before = fs.statSync(image).mtimeMs;
    await Bun.sleep(20);

    const { exitCode } = await runCli(["watch", projectDir, "--once"]);

    expect(exitCode).toBe(0);
    expect(fs.statSync(image).mtimeMs).toBeGreaterThan(before);
  }, 90_000);

  it("watches without a TTY and exits cleanly on SIGTERM", async () => {
    if (!availableFlavor) {
      console.log("Skipping: no compiler installed");
      return;
    }

    const { proc, stdout } = spawnCli([pdfPath, "--with", availableFlavor]);
    await waitForFile(outputPdf, 30_000);

    proc.kill("SIGTERM");
    const exitCode = await proc.exited;

    expect(exitCode).toBe(0);
    expect(await stdout).toContain("✓ page-01");
    expect(await stdout).not.toContain("Raw mode");
  }, 60_000);
});
