import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import fs from "fs";
import path from "path";
import os from "os";
import { runCli, createTestPdf } from "./helpers";

describe("CLI error handling", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "annotate-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("no args: exits 0 and shows root/quickstart page", async () => {
    const { exitCode, stdout } = await runCli([]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("annotate");
  });

  it("non-existent PDF: exits 1 with file error", async () => {
    const ghostPath = path.join(tmpDir, "ghost.pdf");
    const { exitCode, stdout } = await runCli([ghostPath]);
    expect(exitCode).toBe(1);
    expect(stdout).toContain("does not exist or is not a PDF");
  });

  it("non-PDF file: exits 1 with file error", async () => {
    const txtPath = path.join(tmpDir, "not-a-pdf.txt");
    fs.writeFileSync(txtPath, "hello");
    const { exitCode, stdout } = await runCli([txtPath]);
    expect(exitCode).toBe(1);
    expect(stdout).toContain("does not exist or is not a PDF");
  });

  it("missing --with for new project: exits 1 with hint", async () => {
    const pdfPath = path.join(tmpDir, "test.pdf");
    await createTestPdf(pdfPath);
    const { exitCode, stdout } = await runCli([pdfPath]);
    expect(exitCode).toBe(1);
    expect(stdout).toContain("Use --with latex or --with typst");
  });

  it("watch with non-existent dir: exits 1 with project error", async () => {
    const fakePath = path.join(tmpDir, "nonexistent-project");
    const { exitCode, stdout } = await runCli(["watch", fakePath]);
    expect(exitCode).toBe(1);
    expect(stdout).toContain("valid annotate project");
  });

  it("watch with dir missing pages/: exits 1 with project error", async () => {
    const { exitCode, stdout } = await runCli(["watch", tmpDir]);
    expect(exitCode).toBe(1);
    expect(stdout).toContain("valid annotate project");
  });
});
