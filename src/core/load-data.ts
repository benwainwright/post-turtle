import fs from "node:fs/promises";
import { defaultDatafile } from "./default-data-file-path.js";
import { HttpRequest } from "../types/http-request.js";

export const loadData = async (path?: string): Promise<HttpRequest[]> => {
  try {
    return JSON.parse(
      await fs.readFile(path ?? defaultDatafile(), "utf8")
    ) as HttpRequest[];
  } catch {
    return [];
  }
};
