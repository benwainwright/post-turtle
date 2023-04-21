import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpRequest } from "../../types/http-request.js";
import { useRequest } from "./use-request.js";
import nock from "nock";
import { FetchError } from "node-fetch";

const exampleServerHost = `http://example-server.com`;

describe("useRequest", () => {
  it("Starts off undefined", () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
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

  it("Returns error objects from the hook", async () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };

    nock(request.host, {
      reqheaders: {
        "content-type": "application/json",
        bar: "baz",
      },
    })
      .get(request.path)
      .replyWithError("Error");

    const { result } = renderHook(() => useRequest(request));

    act(() => {
      result.current.trigger();
    });

    await waitFor(() => {
      const { response, loading } = result.current;
      expect(response).toBeDefined();
      expect(loading).toBeFalsy();
      expect(response).toBeInstanceOf(FetchError);
    });
  });

  it("Triggers the request and returns the response when 'trigger' is called", async () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    nock(request.host, {
      reqheaders: {
        "content-type": "application/json",
        bar: "baz",
      },
    })
      .get(request.path)
      .reply(200, {
        foo: "bar",
      });

    const { result } = renderHook(() => useRequest(request));

    act(() => {
      result.current.trigger();
    });

    await waitFor(() => {
      const { response, loading } = result.current;
      expect(response).toBeDefined();
      expect(loading).toBeFalsy();
      if (response && "statusCode" in response) {
        expect(response?.statusCode).toEqual(200);
        expect(JSON.parse(response?.body)).toEqual({ foo: "bar" });
      }
    });
  });
});
