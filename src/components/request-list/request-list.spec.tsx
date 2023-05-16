import { render } from "ink-testing-library";
import { HttpRequest } from "../../types/http-request.js";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";
import delay from "delay";

jest.unstable_mockModule("cli-highlight", () => ({
  highlight: (thing: unknown) => thing,
}));

const { RequestList } = await import("./request-list.js");

const exampleServerHost = `http://example-server.com`;

describe("<RequestList>", () => {
  it("Renders a list of requestLines", () => {
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

    const { lastFrame } = render(
      <RequestList
        requests={requests}
        onTriggerDelete={jest.fn()}
        onTriggerEdit={jest.fn()}
        onShowTriggerDialog={jest.fn()}
      />
    );

    const expected = `
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

    expect(stripAnsi(lastFrame() ?? "")).toEqual(expected);
  });

  it("Triggers onTriggerEdit with the correct request when you press 'e'", async () => {
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

    const onTriggerEdit = jest.fn();
    const { stdin } = render(
      <RequestList
        requests={requests}
        onTriggerDelete={jest.fn()}
        onTriggerEdit={onTriggerEdit}
        onShowTriggerDialog={jest.fn()}
      />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("e");
    await delay(0);

    expect(onTriggerEdit).toHaveBeenCalledWith(requests[1]);
  });

  it("Triggers onTriggerDelete with the correct request when you press 'd'", async () => {
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

    const onTriggerDelete = jest.fn();
    const { stdin } = render(
      <RequestList
        requests={requests}
        onTriggerDelete={onTriggerDelete}
        onTriggerEdit={jest.fn()}
        onShowTriggerDialog={jest.fn()}
      />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("d");
    await delay(0);

    expect(onTriggerDelete).toHaveBeenCalledWith(requests[1]);
  });

  it("Triggers onShowTriggerDialog when you press 't'", async () => {
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

    const onShowTriggerDialog = jest.fn();
    const { stdin } = render(
      <RequestList
        requests={requests}
        onTriggerDelete={jest.fn()}
        onTriggerEdit={jest.fn()}
        onShowTriggerDialog={onShowTriggerDialog}
      />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("t");
    await delay(0);

    expect(onShowTriggerDialog).toHaveBeenCalledWith(requests[1]);
  });
});
