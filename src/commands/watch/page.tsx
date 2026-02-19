import { useState, useEffect, useCallback } from "react";
import { Box, useApp, useInput } from "ink";
import { Header } from "../../ui/header";
import { Layout } from "../../ui/layout";
import { Shortcuts } from "../../ui/shortcuts";
import { CompileRow } from "../../ui/compile-row";
import { useCompiler } from "../../hooks";
import { Clipboard } from "../../utils";
import type { CompilerEmitter } from "../../compiler/emitter";
import type { WatchHandle } from "../../compiler";

const TOAST_DURATION_MS = 1500;

type WatchPageProps = {
  emitter: CompilerEmitter;
  watchHandle: WatchHandle;
};

function WatchPage({ emitter, watchHandle }: WatchPageProps) {
  const { exit } = useApp();
  const pages = useCompiler(emitter);
  const sorted = [...pages.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; error: boolean } | null>(null);

  // Keep selectedIndex in bounds as pages appear/disappear
  useEffect(() => {
    if (sorted.length > 0) {
      setSelectedIndex((i) => Math.min(i, sorted.length - 1));
    }
  }, [sorted.length]);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [toast]);

  const selectedPage = sorted[selectedIndex] ?? null;

  const showToast = useCallback((msg: string, error = false) => {
    setToast({ message: msg, error });
  }, []);

  useInput((input, key) => {
    // Quit
    if (input === "q" || (key.ctrl && input === "c")) {
      watchHandle.stop();
      exit();
      return;
    }

    // Navigation
    if (input === "j" || key.downArrow) {
      setToast(null);
      setSelectedIndex((i) => Math.min(i + 1, sorted.length - 1));
      return;
    }
    if (input === "k" || key.upArrow) {
      setToast(null);
      setSelectedIndex((i) => Math.max(i - 1, 0));
      return;
    }

    // Copy source
    if (input === "c" && selectedPage?.inputPath) {
      Clipboard.copyFile(selectedPage.inputPath)
        .then(() => showToast("Copied!"))
        .catch(() => showToast("Copy failed", true));
      return;
    }

    // Copy error log
    if (input === "e" && selectedPage?.errorLogPath) {
      Clipboard.copyFile(selectedPage.errorLogPath)
        .then(() => showToast("Copied!"))
        .catch(() => showToast("Copy failed", true));
      return;
    }
  });

  const hasError = selectedPage?.status === "error";

  const shortcuts = [
    { key: "↑/↓", label: "navigate" },
    { key: "c", label: "copy source" },
    ...(hasError ? [{ key: "e", label: "copy error" }] : []),
    { key: "q", label: "quit" },
  ];

  return (
    <Layout>
      <Header />
      <Box flexDirection="column" marginTop={1}>
        {sorted.map((page, i) => (
          <CompileRow
            key={page.name}
            page={page}
            selected={i === selectedIndex}
            toast={toast?.message ?? null}
            toastError={toast?.error ?? false}
          />
        ))}
      </Box>
      <Box marginTop={1}>
        <Shortcuts shortcuts={shortcuts} />
      </Box>
    </Layout>
  );
}

export { WatchPage };
