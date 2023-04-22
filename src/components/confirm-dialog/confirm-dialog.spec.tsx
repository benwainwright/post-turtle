import { render } from "ink-testing-library";
import { ConfirmDialog } from "./confirm-dialog.js";
import { jest } from "@jest/globals";
import stripAnsi from "strip-ansi";
import delay from "delay";

describe("<ConfirmDialog>", () => {
  it("Renders the correct output", () => {
    const { lastFrame } = render(
      <ConfirmDialog
        message="Are you sure?"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );
    const expected = `
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│Are you sure?                                                                                     │
│                                                                                                  │
│┌─────────────┐┌────────────┐                                                                     │
││   Confirm   ││   Cancel   │                                                                     │
│└─────────────┘└────────────┘                                                                     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
`.trim();

    expect(stripAnsi(lastFrame() ?? "")).toEqual(expected);
  });

  it("Calls the onOk callback when you press enter on it", async () => {
    const onOk = jest.fn();
    const { stdin } = render(
      <ConfirmDialog message="Are you sure?" onOk={onOk} onCancel={jest.fn()} />
    );

    await delay(0);

    stdin.write("\t");
    await delay(0);
    stdin.write("\r");

    expect(onOk).toHaveBeenCalled();
  });

  it("Calls the onCancel when you press enter on it", async () => {
    const onCancel = jest.fn();
    const { stdin } = render(
      <ConfirmDialog
        message="Are you sure?"
        onOk={jest.fn()}
        onCancel={onCancel}
      />
    );

    await delay(0);

    stdin.write("\t");
    await delay(0);
    stdin.write("\t");
    await delay(0);
    stdin.write("\r");

    expect(onCancel).toHaveBeenCalled();
  });
});
