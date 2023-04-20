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
  startEdit: boolean;
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
  startEdit,
}: KeyValueAddFieldRowProps) => {
  const [editingLeft, setEditingLeft] = useState(true);
  const [editingRight, setEditingRight] = useState(false);

  const isEditing = Boolean(editing === id);

  useEffect(() => {
    setEditingLeft((startEdit && isEditing) ?? false);
    setEditingRight(false);
  }, [isEditing, startEdit]);

  useEffect(() => {
    if (isEditing) {
      if (editingLeft) {
        onChangeEditStatus(EditStatus.InKey);
      } else if (editingRight) {
        onChangeEditStatus(EditStatus.InValue);
      }
    }
  }, [editingLeft, editingRight, isEditing]);

  useInput((char, key) => {
    if (char === "e" && isEditing && !editingLeft && !editingRight) {
      setEditingLeft(true);
      setEditingRight(false);
    }

    if (key.return && isEditing && editingLeft) {
      setEditingLeft(false);
      setEditingRight(true);
    }

    if (key.return && isEditing && editingRight) {
      finishEditing();
      setEditingLeft(false);
      setEditingRight(false);
    }
  });

  const chevron = isEditing ? <Text>› </Text> : <Text> </Text>;

  return (
    <Box flexDirection="row">
      <Text color={isEditing ? "red" : "white"}>
        {chevron}
        <TextInput
          value={keyName}
          showCursor={false}
          focus={editingLeft}
          placeholder="header-name"
          onChange={(newKey) => {
            onChange({ ...fieldValue, [id]: { key: newKey, value } });
          }}
        />
        <Text>:</Text>
        <TextInput
          showCursor={false}
          value={value}
          focus={editingRight}
          placeholder="header-value"
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
