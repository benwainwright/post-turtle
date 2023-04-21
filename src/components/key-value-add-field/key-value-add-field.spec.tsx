import { render, cleanup } from "ink-testing-library";
import { jest } from "@jest/globals";
import delay from "delay";
import stripAnsi from "strip-ansi";

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

    expect(onChange).toBeCalledWith({
      "mock-id": {
        key: "",
        value: "",
      },
    });
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
