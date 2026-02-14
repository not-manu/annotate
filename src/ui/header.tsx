import { Box, Text } from "ink";
import { Core } from "../core";

type HeaderProps = {
  variant?: "default" | "large";
  style?: "default" | "error";
};

function Header({
  variant = "default",
  style = "default",
}: Partial<HeaderProps>) {
  return (
    <Box flexDirection="column">
      <Text bold color={style === "error" ? "red" : "green"}>
        {Core.NAME} <Text dimColor>v{Core.VERSION}</Text>
      </Text>
      {variant == "large" && (
        <Text italic color={style === "error" ? "red" : "gray"}>
          {Core.DESCRIPTION}
        </Text>
      )}
    </Box>
  );
}

export { Header };
