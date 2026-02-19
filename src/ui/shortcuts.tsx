import { Box, Text } from "ink";

type Shortcut = {
  key: string;
  label: string;
};

type ShortcutsProps = {
  shortcuts: Shortcut[];
};

function Shortcuts({ shortcuts }: ShortcutsProps) {
  return (
    <Box flexDirection="row" gap={2} paddingLeft={2}>
      {shortcuts.map((s) => (
        <Box key={s.key} flexDirection="row" gap={1}>
          <Text color="gray">{s.key}</Text>
          <Text dimColor>{s.label}</Text>
        </Box>
      ))}
    </Box>
  );
}

export { Shortcuts };
export type { Shortcut, ShortcutsProps };
