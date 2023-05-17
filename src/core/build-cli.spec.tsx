import { jest } from "@jest/globals";
import { mkdtemp, rmdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HttpRequest } from "../types/http-request.js";

const mockApp = jest.fn(() => <></>);
const mockTriggerForm = jest.fn(() => <></>);

const TEST_PROGRAM_NAME = `test-program-name`;
const NODE = `node`;

const oldCwd = process.cwd;

const getPackageJson =
  jest.fn<
    () => Promise<{ name: string; description: string; version: string }>
  >();

jest.unstable_mockModule("cli-highlight", () => ({
  highlight: (thing: unknown) => thing,
}));

jest.unstable_mockModule("../components/app/app.js", () => ({
  App: mockApp,
}));

jest.unstable_mockModule("./get-package-json.js", () => ({
  getPackageJson,
}));

jest.unstable_mockModule("../components/trigger-form/index.js", () => ({
  TriggerForm: mockTriggerForm,
}));

jest.unstable_mockModule("./default-data-file-path.js", () => ({
  defaultDatafile: () => `${process.cwd()}/requests.json`,
}));

const { buildCli } = await import("./build-cli.js");

let path: string | undefined;

beforeEach(async () => {
  path = await mkdtemp(join(tmpdir(), "app-test"));
  process.cwd = () => path ?? "";
});

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
  process.cwd = oldCwd;

  mockApp.mockClear();
  mockTriggerForm.mockClear();
});

describe("build CLI", () => {
  it("calls triggerForm for the request passed in at the command line", async () => {
    const exampleServerHost = `http://example-server.com`;
    const requests: HttpRequest[] = [
      {
        id: "foo",
        slug: "foo",
        title: "foo",
        method: "GET",
        host: exampleServerHost,
        path: "path",
        headers: {
          "foo-header": {
            key: "bar",
            value: "baz",
          },
        },
      },
    ];

    await writeFile(`${path}/requests.json`, JSON.stringify(requests));

    getPackageJson.mockResolvedValue({
      name: "foo",
      description: "foo",
      version: "foo",
    });
    const program = await buildCli();

    program.parse(["call", "foo"], { from: "user" });
    expect(mockTriggerForm).toHaveBeenCalledWith(
      expect.objectContaining({
        request: requests[0],
        nonInteractive: true,
      }),
      expect.anything()
    );
  });

  it("corretly hydrates the request with command line options if the request has paramaters", async () => {
    const exampleServerHost = `http://example-server.com`;
    const requests: HttpRequest[] = [
      {
        id: "foo",
        slug: "foo",
        title: "foo",
        method: "GET",
        host: exampleServerHost,
        path: "path/{{ id }}",
        headers: {
          "foo-header": {
            key: "bar",
            value: "baz",
          },
        },
      },
    ];

    await writeFile(`${path}/requests.json`, JSON.stringify(requests));

    getPackageJson.mockResolvedValue({
      name: "foo",
      description: "foo",
      version: "foo",
    });
    const program = await buildCli();

    const newRequest = { ...requests[0], path: "path/bar" };

    program.parse(["call", "foo", "--id", "bar"], { from: "user" });
    expect(mockTriggerForm).toHaveBeenCalledWith(
      expect.objectContaining({
        request: newRequest,
        nonInteractive: true,
      }),
      expect.anything()
    );
  });

  it("Parses the name and description from the package JSON", async () => {
    const description = `my-description`;
    const version = `1.2.3`;
    const name = `my-name`;
    getPackageJson.mockResolvedValue({ name, description, version });
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
