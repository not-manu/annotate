import { Box, Text } from "ink";
import type { PageState } from "../hooks";
import { Spinner } from "./spinner";

function formatElapsed(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

type CompileRowProps = {
  page: PageState;
  selected?: boolean;
  toast?: string | null;
  toastError?: boolean;
};

function CompileRow({ page, selected = false, toast, toastError = false }: CompileRowProps) {
  // For error rows, the log filename lives outside the background
  const errorLogName =
    page.status === "error" && page.errorLogPath
      ? page.errorLogPath.split("/").pop()
      : null;

  return (
    <Box flexDirection="row">
      <Box gap={1} paddingX={1} backgroundColor={selected ? "#2a2a2a" : undefined}>
        <Status page={page} />
        <Text>{page.name}</Text>
        <Detail page={page} />
      </Box>
      {errorLogName && (
        <Box paddingLeft={1}>
          <Text dimColor>see {errorLogName}</Text>
        </Box>
      )}
      {selected && toast && (
        <Box paddingLeft={1}>
          <Text color={toastError ? "red" : "green"}>{toast}</Text>
        </Box>
      )}
    </Box>
  );
}

function Status({ page }: { page: PageState }) {
  if (page.status === "compiling") return <Spinner />;
  if (page.status === "success") return <Text color="green">✓</Text>;
  if (page.status === "error") return <Text color="red">✗</Text>;
  return <Text dimColor>·</Text>;
}

function Detail({ page }: { page: PageState }) {
  if (page.status === "idle") {
    return <Text dimColor>waiting</Text>;
  }

  if (page.status === "compiling") {
    return <Text dimColor>compiling...</Text>;
  }

  const elapsed = page.elapsed != null ? formatElapsed(page.elapsed) : null;

  if (page.status === "success") {
    return <Text dimColor>{elapsed}</Text>;
  }

  // error — only show elapsed here; log filename is rendered outside the bg box
  return <Text dimColor>{elapsed}</Text>;
}

export { CompileRow };
