import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface PackageJson {
  name: string;
  version: string;
  description: string;
  bin: Record<string, unknown>;
}

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export const getPackageJson = async (): Promise<PackageJson> => {
  const rootDir = join(currentDirectory, "..", "..");
  const packageJsonPath = `${rootDir}/package.json`;
  return JSON.parse(await readFile(packageJsonPath, "utf8"));
};
