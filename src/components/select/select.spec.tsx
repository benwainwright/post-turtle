import { render } from "ink-testing-library";
import { Select } from "./select.js";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";
import delay from "delay";

const arrowLeft = "\u001B[D";
const arrowRight = "\u001B[C";

describe("<Select />", () => {
  it("Renders all the options", () => {
    const { lastFrame } = render(
      <Select
        label="Select"
        options={["Foo", "Bar"]}
        value="Foo"
        onChange={jest.fn()}
      />
    );

    const expected = `
┌──────────────────────────────────────────────────────────────────────────────┐
│Select Foo   Bar                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
`.trim();
    expect(stripAnsi(lastFrame() ?? "")).toEqual(expected);
  });

  it("Calls the onChange handler with the correct value when you move the value to the right", async () => {
    const onChange = jest.fn();
    const { stdin } = render(
      <Select
        label="Select"
        options={["Foo", "Bar"]}
        value="Foo"
        onChange={onChange}
      />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write(`${arrowRight}`);
    await delay(0);
    expect(onChange).toHaveBeenCalledWith("Bar");
  });

  it("Calls the onChange handler with the correct value when you move the value to the left", async () => {
    const onChange = jest.fn();
    const { stdin } = render(
      <Select
        label="Select"
        options={["Foo", "Bar"]}
        value="Bar"
        onChange={onChange}
      />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write(`${arrowLeft}`);
    await delay(0);
    expect(onChange).toHaveBeenCalledWith("Foo");
  });

  it("Doesn't move the selected item if already at the start of the list", async () => {
    const onChange = jest.fn();
    const { stdin } = render(
      <Select
        label="Select"
        options={["Foo", "Bar"]}
        value="Foo"
        onChange={onChange}
      />
    );

    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write(`${arrowLeft}`);
    await delay(0);
    expect(onChange).toHaveBeenCalledWith("Foo");
  });

  it("Doesn't move the selected item if already at the end of the list", async () => {
    const onChange = jest.fn();
    const { stdin } = render(
      <Select
        label="Select"
        options={["Foo", "Bar"]}
        value="Foo"
        onChange={onChange}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write(`${arrowRight}`);
    await delay(20);
    stdin.write(`${arrowRight}`);
    await delay(20);
    stdin.write(`${arrowRight}`);
    await delay(20);
    expect(onChange).toHaveBeenNthCalledWith(2, "Bar");
  });
});
