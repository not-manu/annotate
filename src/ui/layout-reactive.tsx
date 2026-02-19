import { useApp, useInput } from "ink";
import { Layout } from "./layout";

type LayoutReactiveProps = {
  children: React.ReactNode;
  onExit?: () => void;
};

function LayoutReactive({ children, onExit }: LayoutReactiveProps) {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      onExit?.();
      exit();
    }
  });

  return <Layout>{children}</Layout>;
}

export { LayoutReactive };
