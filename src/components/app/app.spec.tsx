import { render, cleanup } from "ink-testing-library";
import { jest } from "@jest/globals";
import delay from "delay";
import stripAnsi from "strip-ansi";
import { mkdtemp, rmdir, writeFile } from "fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { HttpRequest } from "../../types/http-request.js";
import { Text } from "ink";

const oldCwd = process.cwd;

const exampleServerHost = `http://example-server.com`;

jest.unstable_mockModule("cli-highlight", () => ({
  highlight: (thing: unknown) => thing,
}));

const mockEditRequestForm = jest.fn(() => <Text>Edit</Text>);
const mockTriggerForm = jest.fn(() => <Text>Trigger</Text>);

jest.unstable_mockModule("../edit-request-form/index.js", () => ({
  EditRequestForm: mockEditRequestForm,
}));

jest.unstable_mockModule("../trigger-form/index.js", () => ({
  TriggerForm: mockTriggerForm,
}));

jest.unstable_mockModule("../../core/default-data-file-path.js", () => ({
  defaultDatafile: () => `${process.cwd()}/requests.json`,
}));

let path: string | undefined;

beforeEach(async () => {
  cleanup();
  path = await mkdtemp(join(tmpdir(), "app-test"));
  process.cwd = () => path ?? "";
});

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
  process.cwd = oldCwd;
});

const { App } = await import("./app.js");

describe("The app component", () => {
  it("Displays a loading message on startup", () => {
    const { lastFrame } = render(<App />);

    expect(stripAnsi(lastFrame() ?? "")).toEqual("Loading requests from disk");
  });

  it("Displays some helpful starter text if there is no data", async () => {
    const { lastFrame } = render(<App />);

    await delay(10);

    expect(stripAnsi(lastFrame() ?? "").trim()).toEqual(
      "You've not created any requests. Press 'a' to get started!".trim()
    );
  });

  it("Displays the edit form if you press 'a'", async () => {
    const { lastFrame, stdin } = render(<App />);

    await delay(10);

    stdin.write("a");

    expect(lastFrame()).toEqual("Edit");
  });

  it("Calls the trigger form with the right request if you press t", async () => {
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
    const { lastFrame, stdin } = render(<App />);
    await delay(10);

    stdin.write("\t");
    await delay(10);
    stdin.write("\t");
    await delay(10);
    stdin.write("t");
    expect(lastFrame()).toEqual("Trigger");
    expect(mockTriggerForm).toHaveBeenCalledWith(
      expect.objectContaining({
        request: {
          id: "foo-bar",
          slug: "foo-bar",
          title: "Foobar",
          method: "POST",
          host: exampleServerHost,
          path: "/another/path",
        },
      }),
      expect.anything()
    );
  });

  it("Displays a list of requests if there is some data", async () => {
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
    const { lastFrame } = render(<App />);

    await delay(10);

    const expected = `
Press 'a' to create a new request, 'e' to edit a request or 'd' to delete a request
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│foo  GET  http://example-server.com/path                                                          │
│                                                                                                  │
│Headers                                                                                           │
│bar: baz                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│Foobar  POST  http://example-server.com/another/path                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
`.trim();

    expect(stripAnsi(lastFrame() ?? "").trim()).toEqual(expected);
  });
});
