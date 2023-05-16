import { mkdtemp, rmdir, writeFile } from "fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { jest } from "@jest/globals";
import { HttpRequest } from "../types/http-request.js";

let path: string | undefined;

const oldCwd = process.cwd;

beforeEach(async () => {
  path = await mkdtemp(join(tmpdir(), "use-storage-test-"));
  process.cwd = () => path ?? "";
});

jest.unstable_mockModule("./default-data-file-path.js", () => ({
  defaultDatafile: () => `${process.cwd()}/requests.json`,
}));

const { loadData } = await import("./load-data.js");

const exampleServerHost = `http://example-server.com`;

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
  process.cwd = oldCwd;
});

describe("loadData", () => {
  it("loads data from disk correctly", async () => {
    const requests: HttpRequest[] = [
      {
        id: "foo",
        slug: "foo",
        title: "foo",
        method: "GET",
        host: exampleServerHost,
        path: "/path",
        headers: {
          "foo-header": {
            key: "bar",
            value: "baz",
          },
        },
      },
      {
        id: "foo-bar",
        slug: "foo-bar",
        title: "Foobar",
        method: "POST",
        host: exampleServerHost,
        path: "/another/path",
      },
    ];
    await writeFile(`${path}/requests.json`, JSON.stringify(requests));
    const result = await loadData();
    expect(result).toStrictEqual(requests);
  });

  it("returns an empty array if data isn't there", async () => {
    const result = await loadData();
    expect(result).toStrictEqual([]);
  });
});
