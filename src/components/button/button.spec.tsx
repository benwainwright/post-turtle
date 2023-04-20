import { render } from "ink-testing-library";
import { jest } from "@jest/globals";
import { Button } from "./button.js";

describe("<Button>", () => {
  it("Renders the button with the correct label", () => {
    const { lastFrame } = render(<Button label="Test" onEnter={jest.fn()} />);

    expect(lastFrame()).toEqual(
      `
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│   Test                                                                                           │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘ 
    `.trim()
    );
  });
});
