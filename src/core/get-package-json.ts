import { readFile } from "node:fs/promises";
import { getSourceRoot } from "../get-source-root.js";

interface PackageJson {
  name: string;
  version: string;
  description: string;
}

export const getPackageJson = async (): Promise<PackageJson> => {
  const rootDir = getSourceRoot();
  const packageJsonPath = `${rootDir}/package.json`;
  return JSON.parse(await readFile(packageJsonPath, "utf8"));
};
