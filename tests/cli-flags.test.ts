import { describe, it, expect } from "bun:test";
import { runCli } from "./helpers";
import pkg from "../package.json";

describe("CLI flags", () => {
  it("--version exits 0 and prints version", async () => {
    const { stdout, exitCode } = await runCli(["--version"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain(pkg.version);
  });

  it("-V (short flag) exits 0 and prints version", async () => {
    const { stdout, exitCode } = await runCli(["-V"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain(pkg.version);
  });

  it("--help exits 0 and shows usage", async () => {
    const { stdout, exitCode } = await runCli(["--help"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("annotate");
    expect(stdout).toContain("[pdf]");
    expect(stdout).toContain("--with");
  });

  it("watch --help exits 0 and shows watch usage", async () => {
    const { stdout, exitCode } = await runCli(["watch", "--help"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("watch");
    expect(stdout).toContain("<project>");
  });
});
