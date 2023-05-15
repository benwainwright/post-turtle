import { mkdtemp, readFile, rmdir, writeFile } from "fs/promises";
import { getPackageJson } from "./get-package-json.js";
import os from "os";
import { dirname, join } from "node:path";
let path: string | undefined;

const oldCwd = process.cwd;

beforeEach(async () => {
  path = await mkdtemp(join(os.tmpdir(), "package-json-test"));
  process.cwd = () => path ?? "";
});

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
  process.cwd = oldCwd;
});

import { fileURLToPath } from "node:url";
import { ENVIRONMENT_VARIABLES } from "./constants.js";
const currentDirectory = dirname(fileURLToPath(import.meta.url));

const rootDir = join(currentDirectory, "..", "..");

describe("getVersionFromPackageJson", () => {
  it("Returns the version from the package.json file in the actual package regardless of what is in the current directory", async () => {
    process.env[ENVIRONMENT_VARIABLES.IS_DEV] = "true";
    const data = JSON.parse(await readFile(`${rootDir}/package.json`, "utf-8"));
    await writeFile(
      `${path}/package.json`,
      JSON.stringify({ version: "0.5.0", description: "foo" })
    );

    const packageJson = await getPackageJson();
    expect(packageJson.version).toEqual(data.version);
    expect(packageJson.description).toEqual(data.description);
  });
});
