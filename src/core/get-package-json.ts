import { readFile } from "node:fs/promises";

interface PackageJson {
  name: string;
  version: string;
  description: string;
}

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const currentDirectory = dirname(fileURLToPath(import.meta.url));

const rootDir = join(currentDirectory, "..", "..");

export const getPackageJson = async (): Promise<PackageJson> => {
  const packageJsonPath = `${rootDir}/package.json`;
  return JSON.parse(await readFile(packageJsonPath, "utf8"));
};
