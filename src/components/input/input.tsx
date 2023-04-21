import { Box, Text, useFocus } from "ink";
import TextInput from "ink-text-input";
import { INPUT_WIDTH } from "../../core/constants.js";

interface InputProps {
  label: string;
  id?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const Input = ({ label, value, onChange, placeholder }: InputProps) => {
  const { isFocused } = useFocus();
  return (
    <Box
      borderStyle={"single"}
      borderColor={isFocused ? "green" : undefined}
      width={INPUT_WIDTH}
    >
      <Box marginRight={1}>
        <Text>{label}</Text>
      </Box>

      <TextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        focus={isFocused}
      />
    </Box>
  );
};
