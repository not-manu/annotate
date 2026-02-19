import path from "path";
import { useState, useEffect } from "react";
import type { CompilerEmitter } from "../compiler/emitter";

type PageStatus = "idle" | "compiling" | "success" | "error";

type PageState = {
  name: string;
  status: PageStatus;
  startedAt: number | null;
  elapsed: number | null;
  errorLogPath: string | null;
};

function useCompiler(emitter: CompilerEmitter): Map<string, PageState> {
  const [pages, setPages] = useState<Map<string, PageState>>(new Map());

  useEffect(() => {
    const onStart = ({ inputPath }: { inputPath: string }) => {
      const name = path.parse(inputPath).name;
      setPages((prev) => {
        const next = new Map(prev);
        next.set(name, {
          name,
          status: "compiling",
          startedAt: Date.now(),
          elapsed: null,
          errorLogPath: null,
        });
        return next;
      });
    };

    const onEnd = (result: {
      success: boolean;
      inputPath: string;
      errorLogPath: string;
    }) => {
      const name = path.parse(result.inputPath).name;
      setPages((prev) => {
        const next = new Map(prev);
        const existing = prev.get(name);
        const elapsed =
          existing?.startedAt != null ? Date.now() - existing.startedAt : null;
        next.set(name, {
          name,
          status: result.success ? "success" : "error",
          startedAt: existing?.startedAt ?? null,
          elapsed,
          errorLogPath: result.success ? null : result.errorLogPath,
        });
        return next;
      });
    };

    emitter.on("compile:start", onStart);
    emitter.on("compile:end", onEnd);

    return () => {
      emitter.off("compile:start", onStart);
      emitter.off("compile:end", onEnd);
    };
  }, [emitter]);

  return pages;
}

export { useCompiler };
export type { PageState, PageStatus };
