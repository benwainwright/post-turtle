import { Box, Text, useFocus } from "ink";
import TextInput from "ink-text-input";

interface InputProps {
  label: string;
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
      width={60}
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
