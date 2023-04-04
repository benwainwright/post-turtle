import { Box } from "ink";
import { KeyValueAddFieldRow } from "./key-value-add-field-row.js";
import { Header } from "../../types/header.js";

interface KeyValueAddFieldEntriesProps {
  fieldValue: Record<string, Header>;
  onChange: (values: Record<string, Header>) => void;
}

export const KeyValueAddFieldEntries = ({
  fieldValue,
  onChange,
}: KeyValueAddFieldEntriesProps) => {
  return (
    <Box flexDirection="column">
      {Object.entries(fieldValue).map(([key, value]) => (
        <KeyValueAddFieldRow
          id={key}
          key={key}
          keyName={value.key}
          value={value.value}
          onChange={onChange}
          fieldValue={fieldValue}
        />
      ))}
    </Box>
  );
};
