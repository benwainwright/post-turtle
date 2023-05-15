import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ENVIRONMENT_VARIABLES } from "./core/constants.js";
const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const getSourceRoot = () => {
  const isDev = process.env[ENVIRONMENT_VARIABLES.IS_DEV];
  if (isDev) {
    return join(currentDirectory, "..");
  }

  return join(currentDirectory, "..");
};
