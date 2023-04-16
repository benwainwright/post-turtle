import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { Header } from "../../types/header.js";
import { useEffect, useState } from "react";
import { EditStatus } from "./key-value-add-field.js";

interface KeyValueAddFieldRowProps {
  id: string;
  keyName: string;
  value: string;
  editing?: string | undefined;
  fieldValue: Record<string, Header>;
  onChange: (values: Record<string, Header>) => void;
  onChangeEditStatus: (editStatus: EditStatus) => void;
  finishEditing: () => void;
}

export const KeyValueAddFieldRow = ({
  keyName,
  value,
  fieldValue,
  onChange,
  editing,
  id,
  onChangeEditStatus,
  finishEditing,
}: KeyValueAddFieldRowProps) => {
  const [editingLeft, setEditingLeft] = useState(true);
  const [editingRight, setEditingRight] = useState(false);

  const isEditing = Boolean(editing === id);

  useEffect(() => {
    setEditingLeft(false);
    setEditingRight(false);
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      if (editingLeft) {
        onChangeEditStatus(EditStatus.InKey);
      } else if (editingRight) {
        onChangeEditStatus(EditStatus.InValue);
      }
    }
  }, [editingLeft, editingRight, isEditing]);

  useInput((_, key) => {
    if (key.return && isEditing) {
      setEditingLeft(true);
      setEditingRight(false);
    }

    if (key.return && isEditing && editingLeft) {
      setEditingLeft(false);
      setEditingRight(true);
    }

    if (key.return && isEditing && editingRight) {
      setEditingLeft(false);
      setEditingRight(false);
      finishEditing();
    }
  });

  const chevron = isEditing ? <Text>› </Text> : <Text> </Text>;

  return (
    <Box flexDirection="row">
      <Text color={isEditing ? "red" : "white"}>
        {chevron}
        <TextInput
          value={keyName}
          focus={editingLeft}
          onChange={(newKey) => {
            onChange({ ...fieldValue, [id]: { key: newKey, value } });
          }}
        />
        <Text>:</Text>
        <TextInput
          value={value}
          focus={editingRight}
          onChange={(newValue) => {
            onChange({
              ...fieldValue,
              [id]: { key: keyName, value: newValue },
            });
          }}
        />
      </Text>
    </Box>
  );
};
