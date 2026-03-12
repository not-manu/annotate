import { describe, it, expect, beforeAll, beforeEach, afterEach } from "bun:test";
import fs from "fs";
import path from "path";
import os from "os";
import { spawnCli, createTestPdf, waitForFile } from "./helpers";

// Note: Compiler.detect() runs before Project.create() in the root handler,
// so a real compiler must be available to exercise the creation path.
let latexAvailable = false;
let typstAvailable = false;

beforeAll(async () => {
  for (const cmd of ["tectonic", "latexmk", "pdflatex", "xelatex"]) {
    const proc = Bun.spawn([cmd, "--version"], { stdout: "ignore", stderr: "ignore" });
    if ((await proc.exited) === 0) {
      latexAvailable = true;
      break;
    }
  }
  const typst = Bun.spawn(["typst", "--version"], { stdout: "ignore", stderr: "ignore" });
  if ((await typst.exited) === 0) typstAvailable = true;
});

describe("CLI project creation", () => {
  let tmpDir: string;
  let pdfPath: string;

  beforeEach(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "annotate-test-"));
    pdfPath = path.join(tmpDir, "lecture.pdf");
    await createTestPdf(pdfPath, 3);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("LaTeX: creates correct project file structure", async () => {
    if (!latexAvailable) {
      console.log("Skipping: no LaTeX compiler available");
      return;
    }

    const { proc } = spawnCli([pdfPath, "--with", "latex"]);
    const projectDir = path.join(tmpDir, "lecture");
    const pagesDir = path.join(projectDir, "pages");

    await waitForFile(pagesDir, 30_000);
    proc.kill(9);
    await proc.exited;

    expect(fs.existsSync(pagesDir)).toBe(true);
    expect(fs.existsSync(path.join(projectDir, ".annotate", "build"))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, ".annotate", "original.pdf"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "style.sty"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-01.tex"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-02.tex"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-03.tex"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-04.tex"))).toBe(false);

    const page1 = fs.readFileSync(path.join(pagesDir, "page-01.tex"), "utf8");
    expect(page1).toContain("612.00bp");
    expect(page1).toContain("792.00bp");
    expect(page1).toContain("\\usepackage{style}");
  }, 30_000);

  it("Typst: creates correct project file structure", async () => {
    if (!typstAvailable) {
      console.log("Skipping: typst compiler not available");
      return;
    }

    const { proc } = spawnCli([pdfPath, "--with", "typst"]);
    const projectDir = path.join(tmpDir, "lecture");
    const pagesDir = path.join(projectDir, "pages");

    await waitForFile(pagesDir, 30_000);
    proc.kill(9);
    await proc.exited;

    expect(fs.existsSync(pagesDir)).toBe(true);
    expect(fs.existsSync(path.join(projectDir, ".annotate", "build"))).toBe(true);
    expect(fs.existsSync(path.join(projectDir, ".annotate", "original.pdf"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "style.typ"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-01.typ"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-02.typ"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-03.typ"))).toBe(true);
    expect(fs.existsSync(path.join(pagesDir, "page-04.typ"))).toBe(false);

    const page1 = fs.readFileSync(path.join(pagesDir, "page-01.typ"), "utf8");
    expect(page1).toContain("612.00pt");
    expect(page1).toContain("792.00pt");
    expect(page1).toContain('#import "style.typ": *');
  }, 30_000);

  it("re-running on existing project resumes without --with", async () => {
    const flavor = typstAvailable ? "typst" : latexAvailable ? "latex" : null;
    if (!flavor) {
      console.log("Skipping: no compiler available");
      return;
    }

    const projectDir = path.join(tmpDir, "lecture");
    const pagesDir = path.join(projectDir, "pages");

    // First run: create the project
    const { proc: proc1 } = spawnCli([pdfPath, "--with", flavor]);
    await waitForFile(pagesDir, 30_000);
    proc1.kill(9);
    await proc1.exited;

    // Second run: re-open without --with, should not error
    const { proc: proc2, stdout: stdout2 } = spawnCli([pdfPath]);
    await Bun.sleep(2000);
    proc2.kill(9);
    await proc2.exited;

    const out = await stdout2;
    expect(out).not.toContain("Use --with");
  }, 60_000);

  it("watch subcommand on existing project runs without crashing", async () => {
    const flavor = typstAvailable ? "typst" : latexAvailable ? "latex" : null;
    if (!flavor) {
      console.log("Skipping: no compiler available");
      return;
    }

    const projectDir = path.join(tmpDir, "lecture");
    const pagesDir = path.join(projectDir, "pages");

    // Create the project first
    const { proc: proc1 } = spawnCli([pdfPath, "--with", flavor]);
    await waitForFile(pagesDir, 30_000);
    proc1.kill(9);
    await proc1.exited;

    // Use the watch subcommand
    const { proc: proc2 } = spawnCli(["watch", projectDir]);
    await Bun.sleep(1000);
    proc2.kill(9);
    await proc2.exited;
    // If we get here without throwing, the watch command started cleanly
  }, 60_000);
});
