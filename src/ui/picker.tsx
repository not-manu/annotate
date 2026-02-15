import { useState } from "react";
import { Box, Text, useInput } from "ink";

type PickerOption<T extends string = string> = {
  value: T;
  label: string;
};

type PickerProps<T extends string = string> = {
  options: PickerOption<T>[];
  onSelect: (value: T) => void;
};

function Picker<T extends string = string>({
  options,
  onSelect,
}: PickerProps<T>) {
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow || input === "k") {
      setCursor((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    }

    if (key.downArrow || input === "j") {
      setCursor((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    }

    if (key.return) {
      const selected = options[cursor];
      if (selected) onSelect(selected.value);
    }
  });

  return (
    <Box flexDirection="column">
      {options.map((option, i) => {
        const isSelected = i === cursor;
        return (
          <Text key={option.value}>
            <Text color={isSelected ? "green" : "gray"}>
              {isSelected ? "\u25CF" : "\u25CB"}{" "}
            </Text>
            <Text color={isSelected ? "green" : "gray"}>
              {option.label}
            </Text>
          </Text>
        );
      })}
    </Box>
  );
}

export { Picker };
export type { PickerOption, PickerProps };
