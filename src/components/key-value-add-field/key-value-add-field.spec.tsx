import { render } from "ink-testing-library";
import { KeyValueAddField } from "./key-value-add-field.js";
import { jest } from "@jest/globals";

describe("<KeyValueAddField />", () => {
  it("Displays the correct label and a message requesting the user to 'press enter to add headers' if there is no data", () => {
    const { lastFrame } = render(
      <KeyValueAddField label="Headers" onChange={jest.fn()} />
    );

    expect(lastFrame()).toEqual(
      `┌──────────────────────────────────────────────────────────┐
│Headers                                                   │
│Press enter to add headers                                │
└──────────────────────────────────────────────────────────┘`
    );
  });
});
