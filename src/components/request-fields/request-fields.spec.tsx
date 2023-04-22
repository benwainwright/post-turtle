import { render } from "ink-testing-library";
import { HttpRequestWithFields } from "../../types/http-request-with-field.js";
import { RequestFields } from "./request-fields.js";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";
import delay from "delay";

describe("<RequestFields>", () => {
  it("renders the correct output given some fields", () => {
    const fields: HttpRequestWithFields = {
      body: [
        {
          name: "bar",
          replace: "{{bar}}",
          data: "",
        },
      ],
      host: [
        {
          name: "foo",
          replace: "{{ foo }}",
          data: "",
        },
      ],
      path: [
        {
          name: "flux",
          replace: "{{flux}}",
          data: "",
        },
      ],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            // eslint-disable-next-line sonarjs/no-duplicate-string
            replace: "{{ foobar }}",
            data: "",
          },
        ],
      },
    };

    const { lastFrame } = render(
      <RequestFields fields={fields} setFields={jest.fn()} />
    );

    const expected = `
┌──────────────────────────────────────────────────────────────────────────────┐
│foo                                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────┐
│bar                                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────┐
│flux                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────┐
│foobar                                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
    `.trim();

    expect(stripAnsi(lastFrame() ?? "")).toEqual(expected);
  });

  it("calls the setFields handler with the correct value when fields are edited", async () => {
    const fields: HttpRequestWithFields = {
      body: [],
      host: [
        {
          name: "foo",
          replace: "{{ foo }}",
          data: "",
        },
      ],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            data: "",
          },
        ],
      },
    };

    const setFields = jest.fn();

    const { stdin } = render(
      <RequestFields fields={fields} setFields={setFields} />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("foo");
    await delay(0);

    const expectedFields: HttpRequestWithFields = {
      body: [],
      host: [
        {
          name: "foo",
          replace: "{{ foo }}",
          data: "",
        },
      ],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            data: "foo",
          },
        ],
      },
    };

    expect(setFields).toHaveBeenCalledWith(expectedFields);
  });
});
