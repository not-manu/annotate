import { useApp, useInput } from "ink";
import { Layout } from "./layout";

type LayoutReactiveProps = {
  children: React.ReactNode;
};

function LayoutReactive({ children }: LayoutReactiveProps) {
  const { exit } = useApp();

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }
  });

  return <Layout>{children}</Layout>;
}

export { LayoutReactive };
