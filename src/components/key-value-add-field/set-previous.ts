import { Header } from "../../types/header.js";

export const setPrevious = (
  fieldValue: Record<string, Header> | undefined,
  editing: string | undefined,
  setEditing: (entry: string) => void
) => {
  const entries = Object.keys(fieldValue ?? {});
  const currentIndex = entries.indexOf(editing ?? "");
  const prev = currentIndex === 0 ? currentIndex : currentIndex - 1;
  setEditing(entries[prev]);
};
