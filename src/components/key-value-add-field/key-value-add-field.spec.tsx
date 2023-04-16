import { render } from "ink-testing-library";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";

jest.unstable_mockModule("uuid", () => ({
  v4: jest.fn(),
}));

const { KeyValueAddField } = await import("./key-value-add-field.js");
const { v4 } = await import("uuid");

beforeEach(() => {
  jest.mocked(v4).mockReset();
});

describe("<KeyValueAddField />", () => {
  it("Displays the correct label and a message requesting the user to 'press enter to add headers' if there is no data", () => {
    const { lastFrame } = render(
      <KeyValueAddField label="Headers" onChange={jest.fn()} />
    );

    expect(stripAnsi(lastFrame() ?? "")).toEqual(
      `

┌──────────────────────────────────────────────────────────┐
│Headers                                                   │
│Press enter to add headers                                │
│                                                          │
│'e' to edit or 'a' for new item                           │
└──────────────────────────────────────────────────────────┘
`.trim()
    );
  });

  it("Calls the onChange with an empty header if you press enter", async () => {
    const onChange = jest.fn();

    jest.mocked(v4).mockReturnValue("mock-id");

    const { stdin } = render(
      <KeyValueAddField label="Headers" onChange={onChange} />
    );

    stdin.write(`a`);

    expect(onChange).toBeCalledWith({
      "mock-id": {
        key: "",
        value: "",
      },
    });
  });

  it("Allows you to start editing the new header straight away", async () => {
    const onChange = jest.fn();

    jest.mocked(v4).mockReturnValue("mock-id");

    const { stdin } = render(
      <KeyValueAddField label="Headers" onChange={onChange} />
    );

    stdin.write(`a`);
    stdin.write(`f`);

    expect(onChange).toBeCalledWith({
      "mock-id": {
        key: "f",
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
┌──────────────────────────────────────────────────────────┐
│Headers                                                   │
│header-name:header-value                                  │
│another-header:its-value                                  │
│                                                          │
│'e' to edit or 'a' for new item                           │
└──────────────────────────────────────────────────────────┘
`.trim()
    );
  });

  // it("Each of the header fields can be tabbed into and edited", async () => {
  //   const values = {
  //     [`test-id`]: { key: "header-name", value: "header-value" },
  //     [`test-id-2`]: { key: "another-header", value: "its-value" },
  //   };
  //   const { lastFrame } = render(
  //     <KeyValueAddField
  //       label="Headers"
  //       onChange={jest.fn()}
  //       fieldValue={values}
  //     />
  //   );

  //   expect(lastFrame()).toEqual(
  //     `
  // ┌──────────────────────────────────────────────────────────┐
  // │Headers                                                   │
  // │header-name:header-value                                  │
  // │another-header:its-value                                  │
  // └──────────────────────────────────────────────────────────┘
  // `.trim()
  //   );
  // });
});
