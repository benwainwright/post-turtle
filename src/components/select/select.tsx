import { useInput, Text, Box, useFocus } from "ink";
import { INPUT_WIDTH } from "../../core/constants.js";

interface SelectProps {
  label: string;
  options: ReadonlyArray<string>;
  value: string;
  onChange: (value: string) => void;
}
export const Select = ({ label, options, value, onChange }: SelectProps) => {
  const { isFocused } = useFocus();
  const selectedIndex = options.findIndex((option) => option === value);
  useInput((_, key) => {
    if (key.rightArrow) {
      const next =
        selectedIndex === options.length - 1
          ? selectedIndex
          : selectedIndex + 1;
      onChange(options[next]);
    }

    if (key.leftArrow) {
      const next = selectedIndex === 0 ? selectedIndex : selectedIndex - 1;
      onChange(options[next]);
    }
  });
  return (
    <Box
      paddingX={1}
      borderStyle={"single"}
      borderColor={isFocused ? "green" : undefined}
      width={"100%"}
    >
      <Box marginRight={1}>
        <Text bold color="green">
          {label}:
        </Text>
      </Box>

      <Box gap={3}>
        {options.map((option, index) => (
          <Text
            key={option}
            color={index === selectedIndex ? "green" : "white"}
          >
            {option}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
