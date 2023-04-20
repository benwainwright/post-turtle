import { Box } from "ink";
import { KeyValueAddFieldRow } from "./key-value-add-field-row.js";
import { Header } from "../../types/header.js";
import { EditStatus } from "./key-value-add-field.js";
import { useEffect, useState } from "react";

interface KeyValueAddFieldEntriesProps {
  fieldValue?: Record<string, Header>;
  onChange: (values: Record<string, Header>) => void;
  editing: string | undefined;
  onChangeEditStatus: (editStatus: EditStatus) => void;
  finishEditing: () => void;
}

export const KeyValueAddFieldEntries = ({
  fieldValue,
  onChange,
  editing,
  onChangeEditStatus,
  finishEditing,
}: KeyValueAddFieldEntriesProps) => {
  if (!fieldValue) {
    return <></>;
  }

  const [oldIds, setOldIds] = useState<string[]>([]);
  const [newId, setNewId] = useState<string | undefined>();

  const ids = Object.entries(fieldValue).map(([key]) => key);

  const { length } = ids;

  useEffect(() => {
    const missing = ids.find((id) => !oldIds.includes(id));
    if (missing) {
      setNewId(missing);
    } else {
      setNewId(undefined);
    }
    setOldIds(ids);
  }, [length]);

  return (
    <Box flexDirection="column">
      {Object.entries(fieldValue).map(([key, value]) => (
        <KeyValueAddFieldRow
          onChangeEditStatus={onChangeEditStatus}
          id={key}
          key={key}
          editing={editing}
          keyName={value.key}
          value={value.value}
          onChange={onChange}
          finishEditing={finishEditing}
          fieldValue={fieldValue}
          startEdit={newId ? key === newId : false}
        />
      ))}
    </Box>
  );
};
