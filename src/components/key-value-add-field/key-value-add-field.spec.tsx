/* eslint-disable sonarjs/no-duplicate-string */
import { render, cleanup } from "ink-testing-library";
import { jest } from "@jest/globals";
import delay from "delay";
import stripAnsi from "strip-ansi";

const arrowUp = "\u001B[A";
const arrowDown = "\u001B[B";

jest.unstable_mockModule("uuid", () => ({
  v4: jest.fn(),
}));

const { KeyValueAddField } = await import("./key-value-add-field.js");

const { v4 } = await import("uuid");

beforeEach(() => {
  jest.mocked(v4).mockReset();
  cleanup();
});

describe("<KeyValueAddField />", () => {
  it("Displays the correct helper text when first rendered", () => {
    const { lastFrame } = render(
      <KeyValueAddField label="Headers" onChange={jest.fn()} />
    );

    expect(stripAnsi(lastFrame() ?? "")).toContain(
      "Press enter to edit header values"
    );
  });

  it("Displays the correct helper text when you start editing and there is no values", async () => {
    const { lastFrame, stdin } = render(
      <KeyValueAddField label="Headers" onChange={jest.fn()} />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("\r");
    await delay(0);

    expect(stripAnsi(lastFrame() ?? "")).toContain(
      "Press 'a' to create a new header"
    );
  });

  it("Calls onChange with an empty header when you press 'a'", async () => {
    const onChange = jest.fn();

    jest.mocked(v4).mockReturnValue("mock-id");

    const { stdin } = render(
      <KeyValueAddField label="Headers" onChange={onChange} />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");
    await delay(20);
    stdin.write(`a`);
    await delay(20);

    expect(onChange).toHaveBeenCalledWith({
      "mock-id": {
        key: "",
        value: "",
      },
    });
  });

  it("allows you to use the up arrow to move up the list of headers", async () => {
    const onChange = jest.fn();

    jest.mocked(v4).mockReturnValue("mock-id");

    const values = {
      [`test-id`]: { key: "header-name", value: "header-value" },
      [`test-id-2`]: { key: "another-header", value: "its-value" },
    };

    const { stdin, lastFrame } = render(
      <KeyValueAddField
        label="Headers"
        onChange={onChange}
        fieldValue={values}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowUp);

    expect(stripAnsi(lastFrame() ?? "")).toContain(
      "› header-name:header-value"
    );
  });

  it("won't go past the top of the list of headers", async () => {
    const onChange = jest.fn();

    jest.mocked(v4).mockReturnValue("mock-id");

    const values = {
      [`test-id`]: { key: "header-name", value: "header-value" },
      [`test-id-2`]: { key: "another-header", value: "its-value" },
    };

    const { stdin, lastFrame } = render(
      <KeyValueAddField
        label="Headers"
        onChange={onChange}
        fieldValue={values}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowUp);
    await delay(20);
    stdin.write(arrowUp);
    await delay(20);
    stdin.write(arrowUp);

    expect(stripAnsi(lastFrame() ?? "")).toContain(
      "› header-name:header-value"
    );
  });

  it("allows you to use the down arrow to move down the list of headers", async () => {
    const onChange = jest.fn();

    jest.mocked(v4).mockReturnValue("mock-id");

    const values = {
      [`test-id`]: { key: "header-name", value: "header-value" },
      [`test-id-2`]: { key: "another-header", value: "its-value" },
    };

    const { stdin, lastFrame } = render(
      <KeyValueAddField
        label="Headers"
        onChange={onChange}
        fieldValue={values}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowDown);

    expect(stripAnsi(lastFrame() ?? "")).toContain(
      "› another-header:its-value"
    );
  });

  it("Won't go past the bottom of the list", async () => {
    const onChange = jest.fn();

    jest.mocked(v4).mockReturnValue("mock-id");

    const values = {
      [`test-id`]: { key: "header-name", value: "header-value" },
      [`test-id-2`]: { key: "another-header", value: "its-value" },
    };

    const { stdin, lastFrame } = render(
      <KeyValueAddField
        label="Headers"
        onChange={onChange}
        fieldValue={values}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowDown);
    await delay(20);
    stdin.write(arrowDown);

    expect(stripAnsi(lastFrame() ?? "")).toContain(
      "› another-header:its-value"
    );
  });

  it("Renders input with actual headers correctly", async () => {
    const values = {
      [`test-id`]: { key: "header-name", value: "header-value" },
      [`test-id-2`]: { key: "another-header", value: "its-value" },
    };
    const { lastFrame } = render(
      <KeyValueAddField
        label="Headers"
        onChange={jest.fn()}
        fieldValue={values}
      />
    );

    expect(stripAnsi(lastFrame() ?? "")).toEqual(
      `
┌──────────────────────────────────────────────────────────────────────────────┐
│Headers                                                                       │
│ header-name:header-value                                                     │
│ another-header:its-value                                                     │
│                                                                              │
│Press enter to edit header values                                             │
└──────────────────────────────────────────────────────────────────────────────┘
  `.trim()
    );
  });
});
