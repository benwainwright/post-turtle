import { renderHook } from "@testing-library/react";
import { HttpRequest } from "../../types/http-request.js";
import { useRequest } from "./use-request.js";

describe("useRequest", () => {
  it("Starts off undefined", () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: "http://example-server.com",
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };

    const { result } = renderHook(() => useRequest(request));

    expect(result.current.response).toBeUndefined();
  });
});
