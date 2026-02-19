import { Box, Text } from "ink";
import type { PageState } from "../hooks";
import { Spinner } from "./spinner";

function formatElapsed(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

type CompileRowProps = {
  page: PageState;
};

function CompileRow({ page }: CompileRowProps) {
  return (
    <Box gap={1}>
      <Status page={page} />
      <Text>{page.name}</Text>
      <Detail page={page} />
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

  // error
  const logName = page.errorLogPath
    ? page.errorLogPath.split("/").pop()
    : null;

  return (
    <Text>
      {elapsed && <Text dimColor>{elapsed} </Text>}
      {logName && <Text dimColor>see {logName}</Text>}
    </Text>
  );
}

export { CompileRow };
