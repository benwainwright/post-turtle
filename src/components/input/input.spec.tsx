import { Input } from "./input.js";
import { render } from "ink-testing-library";
import { jest } from "@jest/globals";

describe("<Input>", () => {
  it("test", () => {
    const { lastFrame } = render(
      <Input label="Test" value="value" onChange={jest.fn()} />
    );

    console.log(lastFrame());
  });
});
