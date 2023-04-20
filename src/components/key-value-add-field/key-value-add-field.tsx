import { useInput, Text, Box, useFocus } from "ink";
import { KeyValueAddFieldEntries } from "./key-value-add-field-entries.js";
import { v4 } from "uuid";
import { Header } from "../../types/header.js";
import { useEffect, useState } from "react";
import { INPUT_WIDTH } from "../../core/constants.js";

export enum EditStatus {
  NotEditing = "NotEditing",
  HeaderSelected = "HeaderSelected",
  EditingEmpty = "EditingEmpty",
  Editing = "Editing",
  InKey = "InKey",
  InValue = "InValue",
}

interface KeyValueAddFieldProps {
  label: string;
  fieldValue?: Record<string, Header>;
  onChange: (values: Record<string, Header>) => void;
}

const getHelperText = (editStatus: EditStatus) => {
  switch (editStatus) {
    case EditStatus.NotEditing:
      return "Press enter to edit header values";
    case EditStatus.HeaderSelected:
      return "Press 'e' to edit or 'a' to add anew header";
    case EditStatus.InKey:
      return "Press 'enter' to switch to editing header value";
    case EditStatus.InValue:
      return "Press 'enter' to save header";
    case EditStatus.Editing:
      return "Use the arrow keys to select a header";
    case EditStatus.EditingEmpty:
      return "Press 'a' to create a new header";
  }
};

export const KeyValueAddField = ({
  label,
  fieldValue,
  onChange,
}: KeyValueAddFieldProps) => {
  const { isFocused } = useFocus();
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState<string | undefined>();
  const [editStatus, setEditStatus] = useState<EditStatus>(
    EditStatus.NotEditing
  );

  useInput((char, key) => {
    if (!isFocused && editMode) {
      setEditing(undefined);
      setEditMode(false);
    }

    if (isFocused) {
      if (key && !editMode) {
        setEditMode(true);
      }

      if (key.downArrow && editMode && EditStatus.Editing) {
        const entries = Object.keys(fieldValue ?? {});
        const currentIndex = entries.indexOf(editing ?? "");
        const next =
          currentIndex === entries.length - 1 ? currentIndex : currentIndex + 1;
        setEditing(entries[next]);
      }

      if (key.upArrow && editMode && EditStatus.Editing) {
        const entries = Object.keys(fieldValue ?? {});
        const currentIndex = entries.indexOf(editing ?? "");
        const prev = currentIndex === 0 ? currentIndex : currentIndex - 1;
        setEditing(entries[prev]);
      }

      if (
        char === "a" &&
        (editStatus === EditStatus.Editing ||
          editStatus === EditStatus.EditingEmpty ||
          editStatus === EditStatus.HeaderSelected)
      ) {
        const id = v4();
        onChange({
          ...fieldValue,
          [id]: { key: "", value: "" },
        });
        setEditing(id);
      }
    }
  });

  useEffect(() => {
    if (editing) {
      setEditStatus(EditStatus.HeaderSelected);
    }

    const count = Object.keys(fieldValue ?? {}).length;

    if (editMode && !editing) {
      setEditStatus(count === 0 ? EditStatus.EditingEmpty : EditStatus.Editing);
    }

    if (!editMode) {
      setEditStatus(EditStatus.NotEditing);
    }
  }, [editMode, editing]);

  return (
    <Box
      flexDirection="column"
      borderStyle={"single"}
      borderColor={isFocused ? "green" : undefined}
      width={INPUT_WIDTH}
    >
      <Box marginRight={1}>
        <Text>{label}</Text>
      </Box>
      <Box flexDirection="row" marginBottom={1}>
        <KeyValueAddFieldEntries
          onChangeEditStatus={(editStatus) => setEditStatus(editStatus)}
          fieldValue={fieldValue}
          onChange={onChange}
          editing={editing}
          finishEditing={() => {
            setEditStatus(
              editing ? EditStatus.HeaderSelected : EditStatus.Editing
            );
          }}
        />
      </Box>
      <Text color="grey">{getHelperText(editStatus)}</Text>
    </Box>
  );
};
