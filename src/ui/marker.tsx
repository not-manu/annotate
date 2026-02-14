import { Text } from "ink";
type MarkerProps = {
  variant?: "text" | "info" | "question" | "error" | "hint";
};
function Marker({ variant = "text" }: MarkerProps) {
  const color =
    variant === "error" ? "red" : variant === "hint" ? "yellow" : "gray";

  return (
    <Text bold color={color}>
      {variant === "text" && "~"}
      {variant === "info" && "!"}
      {variant === "question" && "?"}
      {variant === "error" && "~"}
      {variant === "hint" && "!"}
    </Text>
  );
}
export { Marker };
