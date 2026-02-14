import { Box } from "ink";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <Box
      //      borderStyle="single"
      //      borderColor="gray"
      paddingX={1}
      paddingY={1}
      width={40}
      flexDirection="column"
    >
      {children}
    </Box>
  );
}

export { Layout };
