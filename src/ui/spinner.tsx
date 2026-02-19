import { useState, useEffect } from "react";
import { Text } from "ink";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 80;

type SpinnerProps = {
  color?: string;
};

function Spinner({ color = "yellow" }: SpinnerProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAMES.length);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <Text color={color} bold>
      {FRAMES[frame]}
    </Text>
  );
}

export { Spinner };
