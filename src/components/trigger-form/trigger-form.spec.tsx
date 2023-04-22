import { render } from "ink-testing-library";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";
import { HttpRequest } from "../../types/http-request.js";

jest.unstable_mockModule("cli-highlight", () => ({
  highlight: (thing: unknown) => thing,
}));

const { TriggerForm } = await import("./trigger-form.js");

describe("<TriggerForm>", () => {
  it("renders the correct output", () => {
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
    const { lastFrame } = render(
      <TriggerForm request={request} onClose={jest.fn()} />
    );

    const expected = `
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│foo  GET  http://example-server.com//path                                                         │
│                                                                                                  │
│Headers                                                                                           │
│bar: baz                                                                                          │
│                                                                                                  │
│┌─────────────┐┌───────────┐                                                                      │
││   Trigger   ││   Close   │                                                                      │
│└─────────────┘└───────────┘                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
`.trim();

    expect(stripAnsi(lastFrame() ?? "")).toEqual(expected);
  });
});
