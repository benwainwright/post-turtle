import { readFile } from "node:fs/promises";

interface PackageJson {
  name: string;
  version: string;
  description: string;
}

export const getPackageJson = async (): Promise<PackageJson> => {
  const packageJsonPath = `${process.cwd()}/package.json`;
  const contents = JSON.parse(await readFile(packageJsonPath, "utf8"));
  return contents;
};
