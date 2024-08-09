import { useInput, Text, Box, useFocus } from "ink";
import { KeyValueAddFieldEntries } from "./key-value-add-field-entries.js";
import { Header } from "../../types/header.js";
import { useEffect, useState } from "react";
import { INPUT_WIDTH } from "../../core/constants.js";
import { setNext } from "./set-next.js";
import { setPrevious } from "./set-previous.js";
import { createNew } from "./create-new.js";

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
      return "Press 'e' to edit or 'a' to add a new entry";
    case EditStatus.InKey:
      return "Editing key. Press 'enter' switch to editing value";
    case EditStatus.InValue:
      return "Editing value. Press 'enter' to save header";
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

  useEffect(() => {
    if (!isFocused && editMode) {
      setEditing(undefined);
      setEditMode(false);
    }
  }, [isFocused]);

  useInput((char, key) => {
    if (isFocused) {
      if (key.return && !editMode) {
        setEditMode(true);
      }

      if (key.downArrow && editMode && EditStatus.Editing) {
        setNext(fieldValue, editing, setEditing);
      }

      if (key.upArrow && editMode && EditStatus.Editing) {
        setPrevious(fieldValue, editing, setEditing);
      }

      if (
        char === "a" &&
        (editStatus === EditStatus.Editing ||
          editStatus === EditStatus.EditingEmpty ||
          editStatus === EditStatus.HeaderSelected)
      ) {
        createNew(fieldValue, onChange, setEditing);
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
      paddingX={1}
      flexDirection="column"
      borderStyle={"single"}
      borderColor={isFocused ? "green" : undefined}
      width={"100%"}
    >
      <Box marginRight={1}>
        <Text color="green">{label}:</Text>
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
