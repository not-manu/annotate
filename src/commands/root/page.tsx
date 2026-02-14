import { Box, Text } from "ink";
import { Header } from "../../ui/header";
import { Layout } from "../../ui/layout";

function RootPage() {
  return (
    <Layout>
      <Header variant="large"></Header>
      <Box height={2} />
      <Text bold>Quickstart</Text>
      <Box height={1} />
      <Text>
        <Text color="gray">$</Text> <Text bold>annotate</Text>{" "}
        <Text>some.pdf</Text>
        <Text dimColor> --with </Text>
        <Text>latex</Text>
      </Text>
    </Layout>
  );
}

export { RootPage };
