import { Header } from "../../types/header.js";
import { v4 } from "uuid";

export const createNew = (
  fieldValue: Record<string, Header> | undefined,
  onChange: (values: Record<string, Header>) => void,
  setEditing: (value: string) => void
) => {
  const id = v4();
  onChange({
    ...(fieldValue ?? {}),
    [id]: { key: "", value: "" },
  });
  setEditing(id);
};
