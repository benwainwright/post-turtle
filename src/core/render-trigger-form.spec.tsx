import { jest } from "@jest/globals";
import { HttpRequest } from "../types/http-request.js";
import { renderTriggerForm } from "./render-trigger-form.js";

const mockTriggerForm = jest.fn(() => <></>);
jest.unstable_mockModule("../components/trigger-form/index.js", () => ({
  TriggerForm: mockTriggerForm,
}));

afterEach(async () => {
  mockTriggerForm.mockClear();
});

describe("renderTriggerForm", () => {
  it("calls the triggerForm component correctly", async () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: "foo",
      path: "path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };

    await renderTriggerForm(request);

    expect(mockTriggerForm).toHaveBeenCalledWith(
      expect.objectContaining({
        request,
        nonInteractive: true,
      }),
      expect.anything()
    );
  });
});
