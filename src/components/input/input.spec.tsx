import { Input } from "./input.js";
import { render } from "ink-testing-library";
describe("<Input>", () => {
  it("test", () => {
    const { lastFrame } = render(
      <Input label="Test" value="value" onChange={jest.fn()} />
    );

    console.log(lastFrame());
  });
});
