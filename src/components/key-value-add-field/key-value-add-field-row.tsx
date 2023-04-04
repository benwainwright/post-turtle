import { Box, Text, useFocus } from "ink";
import TextInput from "ink-text-input";
import { useEffect, useState } from "react";
import { Header } from "../../types/header.js";

interface KeyValueAddFieldRowProps {
  id: string;
  keyName: string;
  value: string;
  fieldValue: Record<string, Header>;
  onChange: (values: Record<string, Header>) => void;
}

export const KeyValueAddFieldRow = ({
  keyName,
  value,
  fieldValue,
  onChange,
  id,
}: KeyValueAddFieldRowProps) => {
  const { isFocused: leftFocus } = useFocus({ id });
  const { isFocused: rightFocus } = useFocus();

  return (
    <Box flexDirection="row">
      <TextInput
        value={keyName}
        focus={leftFocus}
        onChange={(newKey) => {
          onChange({ ...fieldValue, [id]: { key: newKey, value } });
        }}
      />
      <Text>:</Text>
      <TextInput
        value={value}
        focus={rightFocus}
        onChange={(newValue) => {
          onChange({ ...fieldValue, [id]: { key: keyName, value: newValue } });
        }}
      />
    </Box>
  );
};
