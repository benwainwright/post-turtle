import { cleanup, render } from "ink-testing-library";
import { jest } from "@jest/globals";
import { Button } from "./button.js";
import delay from "delay";

beforeEach(() => {
  cleanup();
});

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

  it("Calls the callback when enter is pressed", async () => {
    const onEnter = jest.fn();

    const { stdin } = render(<Button label="Test" onEnter={onEnter} />);

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("\r");
    expect(onEnter).toHaveBeenCalled();
  });
});
