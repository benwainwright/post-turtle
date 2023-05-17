import { jest } from "@jest/globals";
import { renderApp } from "./render-app.js";
const mockApp = jest.fn(() => <></>);

jest.unstable_mockModule("../components/app/app.js", () => ({
  App: mockApp,
}));

afterEach(async () => {
  mockApp.mockClear();
});

describe("render app", () => {
  it("calls the 'app' component", async () => {
    await renderApp();
    expect(mockApp).toHaveBeenCalled();
  });
});
