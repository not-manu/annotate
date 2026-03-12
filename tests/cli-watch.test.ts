import { describe, it, expect, beforeAll, beforeEach, afterEach } from "bun:test";
import fs from "fs";
import path from "path";
import os from "os";
import { spawnCli, createTestPdf, waitForFile, waitForFileChange } from "./helpers";

let compilerAvailable = false;
let availableFlavor: "latex" | "typst" | null = null;

beforeAll(async () => {
  // Check typst first (faster, more likely standalone install)
  const typst = Bun.spawn(["typst", "--version"], { stdout: "ignore", stderr: "ignore" });
  if ((await typst.exited) === 0) {
    compilerAvailable = true;
    availableFlavor = "typst";
    return;
  }
  // Fall back to tectonic, then other LaTeX compilers
  for (const cmd of ["tectonic", "latexmk", "pdflatex", "xelatex"]) {
    const proc = Bun.spawn([cmd, "--version"], { stdout: "ignore", stderr: "ignore" });
    if ((await proc.exited) === 0) {
      compilerAvailable = true;
      availableFlavor = "latex";
      return;
    }
  }
});

describe("CLI watch mode recompile", () => {
  let tmpDir: string;
  let pdfPath: string;

  beforeEach(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "annotate-watch-test-"));
    pdfPath = path.join(tmpDir, "lecture.pdf");
    await createTestPdf(pdfPath, 2);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("recompiles and updates output PDF when a page file is saved", async () => {
    if (!compilerAvailable || !availableFlavor) {
      console.log("Skipping: no compiler installed");
      return;
    }

    const { proc } = spawnCli([pdfPath, "--with", availableFlavor]);
    const projectDir = path.join(tmpDir, "lecture");
    const outputPdf = path.join(projectDir, "lecture-annotated.pdf");
    const ext = availableFlavor === "typst" ? ".typ" : ".tex";
    const pageFile = path.join(projectDir, "pages", `page-01${ext}`);

    // Wait for initial compilation (annotated PDF appears)
    await waitForFile(outputPdf, 30_000);
    const initialMtime = fs.statSync(outputPdf).mtime;

    // Touch the page file to trigger recompile
    const originalContent = fs.readFileSync(pageFile, "utf8");
    fs.writeFileSync(pageFile, originalContent + "\n");

    // Wait for the output PDF to be updated
    await waitForFileChange(outputPdf, initialMtime, 30_000);

    proc.kill("SIGTERM");
    await proc.exited;

    expect(fs.statSync(outputPdf).mtime > initialMtime).toBe(true);
  }, 60_000);

  it("recompiles all pages when the style file is saved", async () => {
    if (!compilerAvailable || !availableFlavor) {
      console.log("Skipping: no compiler installed");
      return;
    }

    const { proc } = spawnCli([pdfPath, "--with", availableFlavor]);
    const projectDir = path.join(tmpDir, "lecture");
    const outputPdf = path.join(projectDir, "lecture-annotated.pdf");
    const styleExt = availableFlavor === "typst" ? ".typ" : ".sty";
    const styleFile = path.join(projectDir, "pages", `style${styleExt}`);

    await waitForFile(outputPdf, 30_000);
    const mtime = fs.statSync(outputPdf).mtime;

    fs.appendFileSync(styleFile, "\n");

    await waitForFileChange(outputPdf, mtime, 30_000);

    proc.kill("SIGTERM");
    await proc.exited;

    expect(fs.statSync(outputPdf).mtime > mtime).toBe(true);
  }, 60_000);
});
