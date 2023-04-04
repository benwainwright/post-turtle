import { useInput, Text, Box, useFocus } from "ink";
import { KeyValueAddFieldEntries } from "./key-value-add-field-entries.js";
import { v4 } from "uuid";
import { Header } from "../../types/header.js";
import { useEffect, useState } from "react";

interface KeyValueAddFieldProps {
  label: string;
  fieldValue?: Record<string, Header>;
  onChange: (values: Record<string, Header>) => void;
}

export const KeyValueAddField = ({
  label,
  fieldValue,
  onChange,
}: KeyValueAddFieldProps) => {
  const { isFocused, focus } = useFocus();
  const [addedButNotFocused, setAddedButNotFocused] = useState<
    string | undefined
  >();
  useInput((_, key) => {
    if (key.return) {
      const id = v4();
      onChange({ ...fieldValue, [id]: { key: "", value: "" } });
      setAddedButNotFocused(id);
    }
  });

  useEffect(() => {
    if (addedButNotFocused) {
      focus(addedButNotFocused);
      setAddedButNotFocused(undefined);
    }
  }, [addedButNotFocused]);

  return (
    <Box
      flexDirection="column"
      borderStyle={"single"}
      borderColor={isFocused ? "green" : undefined}
      width={60}
    >
      <Box marginRight={1}>
        <Text>{label}</Text>
      </Box>
      <Box flexDirection="row">
        {!fieldValue || Object.entries(fieldValue).length === 0 ? (
          <Text>Press enter to add headers</Text>
        ) : (
          <KeyValueAddFieldEntries
            fieldValue={fieldValue}
            onChange={onChange}
          />
        )}
      </Box>
    </Box>
  );
};
