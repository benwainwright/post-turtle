import { Input } from "./input.js";
import { render } from "ink-testing-library";
import { jest } from "@jest/globals";

describe("<Input>", () => {
  it("Renders the input correctly", () => {
    const { lastFrame } = render(
      <Input label="Test" value="value" onChange={jest.fn()} />
    );

    expect(lastFrame()).toEqual(
      `
┌──────────────────────────────────────────────────────────┐
│Test value                                                │
└──────────────────────────────────────────────────────────┘
`.trim()
    );
  });
});
