import { jest } from "@jest/globals";
import { mkdtemp, rmdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { HttpRequest } from "../types/http-request.js";
import { PackageJson } from "./get-package-json.js";

const mockRenderApp = jest.fn();
const mockRenderTriggerForm = jest.fn();

const TEST_PROGRAM_NAME = `test-program-name`;
const NODE = `node`;

const oldCwd = process.cwd;

const getPackageJson = jest.fn<() => Promise<PackageJson>>();

jest.unstable_mockModule("cli-highlight", () => ({
  highlight: (thing: unknown) => thing,
}));

jest.unstable_mockModule("./render-app.js", () => ({
  renderApp: mockRenderApp,
}));

jest.unstable_mockModule("./get-package-json.js", () => ({
  getPackageJson,
}));

jest.unstable_mockModule("./render-trigger-form", () => ({
  renderTriggerForm: mockRenderTriggerForm,
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

  mockRenderApp.mockClear();
  mockRenderTriggerForm.mockClear();
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
      bin: {
        pt: "something",
      },
    });
    const program = await buildCli();

    program.parse(["call", "foo"], { from: "user" });
    expect(mockRenderTriggerForm).toHaveBeenCalledWith(requests[0]);
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
      bin: {
        pt: "foo",
      },
    });
    const program = await buildCli();

    const newRequest = { ...requests[0], path: "path/bar" };

    program.parse(["call", "foo", "--id", "bar"], { from: "user" });
    expect(mockRenderTriggerForm).toHaveBeenCalledWith(newRequest);
  });

  it("Parses the name and description from the package JSON", async () => {
    const description = `my-description`;
    const version = `1.2.3`;
    const name = `my-name`;
    getPackageJson.mockResolvedValue({
      name,
      description,
      version,
      bin: { pt: "foo" },
    });
    const program = await buildCli();

    program.parse([NODE, TEST_PROGRAM_NAME]);

    expect(program.description()).toEqual(`post-turtle: ${description}`);
    expect(program.name()).toEqual(`pt`);
  });

  it("should call the interactive mode if there are no arguments", async () => {
    const program = await buildCli();

    program.parse([NODE, TEST_PROGRAM_NAME]);

    expect(mockRenderApp).toHaveBeenCalled();
  });
});
