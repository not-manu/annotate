import { Box } from "ink";
import { Header } from "../../ui/header";
import { LayoutReactive } from "../../ui/layout-reactive";
import { Shortcuts } from "../../ui/shortcuts";
import { CompileRow } from "../../ui/compile-row";
import { useCompiler } from "../../hooks";
import type { CompilerEmitter } from "../../compiler/emitter";
import type { WatchHandle } from "../../compiler";

type WatchPageProps = {
  emitter: CompilerEmitter;
  watchHandle: WatchHandle;
};

function WatchPage({ emitter, watchHandle }: WatchPageProps) {
  const pages = useCompiler(emitter);
  const sorted = [...pages.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const hasErrors = sorted.some((p) => p.status === "error");

  const shortcuts = [
    { key: "q", label: "quit" },
    ...(hasErrors ? [{ key: "e", label: "open error log" }] : []),
  ];

  return (
    <LayoutReactive onExit={() => watchHandle.stop()}>
      <Header />
      <Box flexDirection="column" marginTop={1}>
        {sorted.map((page) => (
          <CompileRow key={page.name} page={page} />
        ))}
      </Box>
      <Box marginTop={1}>
        <Shortcuts shortcuts={shortcuts} />
      </Box>
    </LayoutReactive>
  );
}

export { WatchPage };
