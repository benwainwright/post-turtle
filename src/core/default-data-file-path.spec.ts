import { jest } from "@jest/globals";

jest.unstable_mockModule("node:os", () => ({
  homedir: jest.fn(),
}));

const os = await import("node:os");
const { defaultDatafile } = await import("./default-data-file-path.js");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("default data file path", () => {
  it("returns the config file in the home dir", () => {
    jest.mocked(os.homedir).mockReturnValue("/");

    const result = defaultDatafile();

    expect(result).toEqual("/.post-turtle-requests");
  });
});
