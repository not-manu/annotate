import { Box, Text } from "ink";
import { Header } from "../../ui/header";
import { Layout } from "../../ui/layout";

type ExampleProps = {
  comment?: string;
  cmd: string;
  args?: string;
  flags?: string;
};

function Example({ comment, cmd, args, flags }: ExampleProps) {
  return (
    <Box flexDirection="column">
      {comment && (
        <Text dimColor italic>
          # {comment}
        </Text>
      )}
      <Text>
        <Text color="gray">$ </Text>
        <Text bold color="green">
          {cmd}
        </Text>
        {args && <Text color="white"> {args}</Text>}
        {flags && <Text color="cyan"> {flags}</Text>}
      </Text>
    </Box>
  );
}

function RootPage() {
  return (
    <Layout>
      <Header variant="large" />
      <Box height={1} />
      <Text bold>Quickstart</Text>
      <Box height={1} />
      <Box flexDirection="column" gap={1}>
        <Example
          comment="Annotate a PDF with LaTeX"
          cmd="annotate"
          args="paper.pdf"
          flags="--with latex"
        />
        <Example
          comment="Annotate a PDF with Typst"
          cmd="annotate"
          args="paper.pdf"
          flags="--with typst"
        />
        <Example
          comment="Set up a project for AI agents (generates AGENTS.md, CLAUDE.md, and page images)"
          cmd="annotate"
          args="paper.pdf"
          flags="--with latex --agents"
        />
        <Example
          comment="Export 300 DPI images after each compile"
          cmd="annotate"
          args="paper.pdf"
          flags="--with typst --images"
        />
        <Example
          comment="Resume watching an existing project"
          cmd="annotate watch"
          args="paper/"
        />
      </Box>
    </Layout>
  );
}

export { RootPage };
