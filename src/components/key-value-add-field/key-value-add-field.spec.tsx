import { render } from "ink-testing-library";
import { jest } from "@jest/globals";
import delay from "delay";

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

    expect(lastFrame()).toEqual(
      `
┌──────────────────────────────────────────────────────────┐
│Headers                                                   │
│Press enter to add headers                                │
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

    stdin.write(`\r`);

    expect(onChange).toBeCalledWith({
      "mock-id": {
        key: "",
        value: "",
      },
    });
  });
});
