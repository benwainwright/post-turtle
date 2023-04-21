import { readFile } from "node:fs/promises";

export const getVersionFromPackageJson = async () => {
  const packageJsonPath = `${process.cwd()}/package.json`;
  const contents = JSON.parse(await readFile(packageJsonPath, "utf8"));
  return contents.version;
};
