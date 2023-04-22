import { render, cleanup } from "ink-testing-library";
import { jest } from "@jest/globals";
import delay from "delay";
import stripAnsi from "strip-ansi";
import { mkdtemp, rmdir, writeFile } from "fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { HttpRequest } from "../../types/http-request.js";

const oldCwd = process.cwd;

const exampleServerHost = `http://example-server.com`;

jest.unstable_mockModule("cli-highlight", () => ({
  highlight: (thing: unknown) => thing,
}));

let path: string | undefined;

beforeEach(async () => {
  path = await mkdtemp(join(tmpdir(), "app-test"));
  process.cwd = () => path ?? "";
  cleanup();
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
