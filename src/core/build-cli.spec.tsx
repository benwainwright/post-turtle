import { jest } from "@jest/globals";

const mockApp = jest.fn(() => <></>);

jest.unstable_mockModule("../components/app/app.js", () => ({
  App: mockApp,
}));

describe("build CLI", () => {
  it("should call the interactive mode if there are no arguments", async () => {
    const { buildCli } = await import("./build-cli.js");
    const program = await buildCli();

    await program.parseAsync(["node", "program-name"]);

    expect(mockApp).toHaveBeenCalled();
  });
});
