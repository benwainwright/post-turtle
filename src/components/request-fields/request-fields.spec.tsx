import { render } from "ink-testing-library";
import { HttpRequestWithFields } from "../../types/http-request-with-field.js";
import { RequestFields } from "./request-fields.js";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";
import delay from "delay";

describe("<RequestFields>", () => {
  it("renders the correct output given data with fields in every position", () => {
    const fields: HttpRequestWithFields = {
      body: [
        {
          description: "",
          name: "bar",
          replace: "{{bar}}",
          data: "",
        },
      ],
      host: [
        {
          description: "",
          name: "foo",
          replace: "{{ foo }}",
          data: "",
        },
      ],
      path: [
        {
          description: "",
          name: "flux",
          replace: "{{flux}}",
          data: "",
        },
      ],
      headers: {
        "foo-header": [
          {
            description: "",
            name: "foobar",
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

  it("calls the setFields handler with the correct value when header fields are edited", async () => {
    const fields: HttpRequestWithFields = {
      body: [],
      host: [
        {
          name: "foo",
          replace: "{{ foo }}",
          data: "",
          description: "",
        },
      ],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            data: "",
            description: "",
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
          description: "",
          data: "",
        },
      ],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            description: "",
            data: "foo",
          },
        ],
      },
    };

    expect(setFields).toHaveBeenCalledWith(expectedFields);
  });

  it("calls the setFields handler with the correct value when host fields are edited", async () => {
    const fields: HttpRequestWithFields = {
      body: [],
      host: [
        {
          name: "foo",
          replace: "{{ foo }}",
          description: "",
          data: "",
        },
      ],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            description: "",
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
    stdin.write("foo");
    await delay(0);

    const expectedFields: HttpRequestWithFields = {
      body: [],
      host: [
        {
          name: "foo",
          replace: "{{ foo }}",
          description: "",
          data: "foo",
        },
      ],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            description: "",
            data: "",
          },
        ],
      },
    };

    expect(setFields).toHaveBeenCalledWith(expectedFields);
  });

  it("calls the setFields handler with the correct value when path fields are edited", async () => {
    const fields: HttpRequestWithFields = {
      body: [],
      host: [],
      path: [
        {
          name: "foo",
          replace: "{{ foo }}",
          description: "",
          data: "",
        },
      ],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            description: "",
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
    stdin.write("foo");
    await delay(0);

    const expectedFields: HttpRequestWithFields = {
      body: [],
      host: [],
      path: [
        {
          name: "foo",
          replace: "{{ foo }}",
          description: "",
          data: "foo",
        },
      ],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            description: "",
            data: "",
          },
        ],
      },
    };

    expect(setFields).toHaveBeenCalledWith(expectedFields);
  });

  it("calls the setFields handler with the correct value when body fields are edited", async () => {
    const fields: HttpRequestWithFields = {
      body: [
        {
          name: "foo",
          replace: "{{ foo }}",
          description: "",
          data: "",
        },
      ],
      host: [],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            description: "",
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
    stdin.write("foo");
    await delay(0);

    const expectedFields: HttpRequestWithFields = {
      body: [
        {
          name: "foo",
          replace: "{{ foo }}",
          description: "",
          data: "foo",
        },
      ],
      host: [],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "foobar",
            replace: "{{ foobar }}",
            description: "",
            data: "",
          },
        ],
      },
    };

    expect(setFields).toHaveBeenCalledWith(expectedFields);
  });
});
