import { Header } from "../../types/header.js";

export const setNext = (
  fieldValue: Record<string, Header> | undefined,
  editing: string | undefined,
  setEditing: (entry: string) => void
) => {
  const entries = Object.keys(fieldValue ?? {});
  const currentIndex = entries.indexOf(editing ?? "");
  const next =
    currentIndex === entries.length - 1 ? currentIndex : currentIndex + 1;
  setEditing(entries[next]);
};
