import { Box, Text } from "ink";
import { Header } from "./header";
import { Layout } from "./layout";
import { Marker } from "./marker";

type ErrorPageProps = {
  message: string;
  hint?: string;
};

function ErrorPage({ message, hint }: ErrorPageProps) {
  return (
    <Layout>
      <Header style="error"></Header>
      <Box flexDirection="column" marginTop={1}>
        <Text>
          <Marker variant="error" />
          <Text> {message}</Text>
        </Text>
        {hint && (
          <Text>
            <Marker variant="hint" />
            <Text dimColor> {hint}</Text>
          </Text>
        )}
      </Box>
    </Layout>
  );
}

export { ErrorPage };
