import { readFile } from "node:fs/promises";

interface PackageJson {
  name: string;
  version: string;
  description: string;
}

export const getPackageJson = async (): Promise<PackageJson> => {
  const packageJsonPath = `${process.cwd()}/package.json`;
  return JSON.parse(await readFile(packageJsonPath, "utf8"));
};
