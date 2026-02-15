import { Box } from "ink";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <Box paddingX={1} paddingY={1} flexDirection="column">
      {children}
    </Box>
  );
}

export { Layout };
