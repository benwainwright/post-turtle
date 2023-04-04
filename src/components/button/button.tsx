import { Box, useFocus, useInput, Text } from "ink";

interface ButtonProps {
  label: string;
  onEnter: () => void;
}
export const Button = (props: ButtonProps) => {
  const { isFocused } = useFocus();
  useInput((_, key) => {
    if (isFocused && key.return) {
      props.onEnter();
    }
  });
  return (
    <Box
      paddingX={3}
      paddingY={0}
      borderStyle="single"
      borderColor={isFocused ? "green" : undefined}
    >
      <Text>{props.label}</Text>
    </Box>
  );
};
