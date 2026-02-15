import { Text } from "ink";

type Shortcut = {
  key: string;
  label: string;
};

type ShortcutsProps = {
  shortcuts: Shortcut[];
};

function Shortcuts({ shortcuts }: ShortcutsProps) {
  return (
    <Text>
      {"  "}
      {shortcuts.map((s, i) => (
        <Text key={s.key}>
          {i > 0 && <Text> </Text>}
          <Text color="gray">{s.key}</Text>
          <Text dimColor> {s.label} </Text>
        </Text>
      ))}
    </Text>
  );
}

export { Shortcuts };
export type { Shortcut, ShortcutsProps };
