import { Box, Text } from "ink";
import { Header } from "./header";
import { Layout } from "./layout";

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
          <Text bold color="whiteBright" backgroundColor="red">
            {" "}
            ERROR{" "}
          </Text>
          <Text bold color="red">
            {" "}
            {message}
          </Text>
        </Text>
        {hint && (
          <Text>
            <Text>{"        "}</Text>
            <Text color="red">{hint}</Text>
          </Text>
        )}
      </Box>
    </Layout>
  );
}

export { ErrorPage };
