import { render } from "ink-testing-library";
import { HttpRequest } from "../../types/http-request.js";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";
import delay from "delay";

jest.unstable_mockModule("cli-highlight", () => ({
  highlight: (thing: unknown) => thing,
}));

const { RequestLine } = await import("./request-line.js");

describe("<RequestLine>", () => {
  it("Renders the correct output", () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: "http://example-server.com",
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const { lastFrame } = render(<RequestLine request={request} />);

    const expected = `
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│foo  GET  http://example-server.com/path                                                          │
│                                                                                                  │
│Headers                                                                                           │
│bar: baz                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
`.trim();

    expect(stripAnsi(lastFrame() ?? "")).toEqual(expected);
  });

  it("Fires the onTriggerEdit handler when 'e' is pressed", async () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: "http://example-server.com",
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const onTriggerEdit = jest.fn();
    const { stdin } = render(
      <RequestLine request={request} onTriggerEdit={onTriggerEdit} />
    );

    await delay(0);

    stdin.write("\t");
    await delay(0);
    stdin.write("e");
    expect(onTriggerEdit).toHaveBeenCalled();
  });
});
