import { mkdtemp, rmdir, writeFile } from "fs/promises";
import { getPackageJson } from "./get-package-json.js";
import os from "os";
import { join } from "node:path";
let path: string | undefined;

const oldCwd = process.cwd;

beforeEach(async () => {
  path = await mkdtemp(join(os.tmpdir(), "use-storage-test-"));
  process.cwd = () => path ?? "";
});

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
  process.cwd = oldCwd;
});

describe("getVersionFromPackageJson", () => {
  it("Returns the version from the package.json file in the cwd", async () => {
    await writeFile(
      `${path}/package.json`,
      JSON.stringify({ version: "0.5.0", description: "foo" })
    );

    const packageJson = await getPackageJson();
    expect(packageJson.version).toEqual("0.5.0");
    expect(packageJson.description).toEqual("foo");
  });
});
