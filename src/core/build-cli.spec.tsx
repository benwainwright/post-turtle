import { jest } from "@jest/globals";
import { mkdtemp, rmdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HttpRequest } from "../types/http-request.js";

const mockApp = jest.fn(() => <></>);
const mockRequestLine = jest.fn(() => <></>);

const TEST_PROGRAM_NAME = `test-program-name`;
const NODE = `node`;

const oldCwd = process.cwd;

jest.unstable_mockModule("../components/app/app.js", () => ({
  App: mockApp,
}));

jest.unstable_mockModule("../components/request-line/index.js", () => ({
  RequestLine: mockRequestLine,
}));

const { buildCli } = await import("./build-cli.js");

let path: string | undefined;

beforeEach(async () => {
  path = await mkdtemp(join(tmpdir(), "app-test"));
  process.cwd = () => path ?? "";
  await writeFile(
    `${path}/package.json`,
    JSON.stringify({ name: "foo", description: "foo", version: "bar" })
  );
});

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
  process.cwd = oldCwd;

  mockApp.mockClear();
  mockRequestLine.mockClear();
});

describe("build CLI", () => {
  it("calls requestline for the request passed in at the command line", async () => {
    const exampleServerHost = `http://example-server.com`;
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
    ];

    await writeFile(`${path}/requests.json`, JSON.stringify(requests));

    const program = await buildCli();

    program.parse([NODE, TEST_PROGRAM_NAME, "call", "foo"]);
    expect(mockRequestLine).toHaveBeenCalledWith(
      {
        request: requests[0],
        immediateTrigger: true,
      },
      expect.anything()
    );
  });

  it("Parses the name and description from the package JSON", async () => {
    const description = `my-description`;
    const version = `1.2.3`;
    const name = `my-name`;
    await writeFile(
      `${path}/package.json`,
      JSON.stringify({ name, description, version })
    );
    const program = await buildCli();

    program.parse([NODE, TEST_PROGRAM_NAME]);

    expect(program.description()).toEqual(description);
    expect(program.name()).toEqual(name);
  });

  it("should call the interactive mode if there are no arguments", async () => {
    const program = await buildCli();

    program.parse([NODE, TEST_PROGRAM_NAME]);

    expect(mockApp).toHaveBeenCalled();
  });
});
