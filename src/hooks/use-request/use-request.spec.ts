import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpRequest } from "../../types/http-request.js";
import { useRequest } from "./use-request.js";
import nock from "nock";
import { FetchError } from "node-fetch";
import { HTTP_CONTENT_TYPES, HTTP_HEADERS } from "../../core/constants.js";

const exampleServerHost = `http://example-server.com`;

beforeEach(() => {
  // eslint-disable-next-line import/no-named-as-default-member
  nock.cleanAll();
});

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
        "content-type": HTTP_CONTENT_TYPES.applicationJson,
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
        "bar-header": {
          key: HTTP_HEADERS.contentType,
          value: HTTP_CONTENT_TYPES.applicationJson,
        },
      },
    };
    nock(request.host, {
      reqheaders: {
        bar: "baz",
        [HTTP_HEADERS.contentType]: HTTP_CONTENT_TYPES.applicationJson,
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
      expect(
        response && "statusCode" in response && response?.statusCode
      ).toEqual(200);

      expect(
        response && "body" in response && JSON.parse(response?.body)
      ).toEqual({
        foo: "bar",
      });
    });
  });

  it("Works even if you don't supply headers", async () => {
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
    };
    nock(request.host).get(request.path).reply(200, {
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
      expect(
        response && "statusCode" in response && response?.statusCode
      ).toEqual(200);

      expect(
        response && "body" in response && JSON.parse(response?.body)
      ).toEqual({
        foo: "bar",
      });
    });
  });

  it("Correctly returns raw text with the right content type", async () => {
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
        "bar-header": {
          key: HTTP_HEADERS.contentType,
          value: HTTP_CONTENT_TYPES.applicationJson,
        },
      },
    };
    const mockContent = `Some text!`;
    nock(request.host, {
      reqheaders: {
        bar: "baz",
      },
    })
      .get(request.path)
      .reply(200, mockContent, {
        [HTTP_HEADERS.contentType]: HTTP_CONTENT_TYPES.textPlain,
      });

    const { result } = renderHook(() => useRequest(request));

    act(() => {
      result.current.trigger();
    });

    await waitFor(() => {
      const { response, loading } = result.current;
      expect(response).toBeDefined();
      expect(loading).toBeFalsy();
      expect(
        response && "statusCode" in response && response?.statusCode
      ).toEqual(200);

      expect(response && "body" in response && response?.body).toEqual(
        mockContent
      );

      expect(
        response && "contentType" in response && response.contentType
      ).toEqual("text");
    });
  });

  it("Correctly returns raw HTML with the right content type", async () => {
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
        "bar-header": {
          key: HTTP_HEADERS.contentType,
          value: HTTP_CONTENT_TYPES.applicationJson,
        },
      },
    };
    const mockContent = `<!DOCTYPE html><html><head></head><h1>Test</h1></html>`;
    nock(request.host, {
      reqheaders: {
        bar: "baz",
        [HTTP_HEADERS.contentType]: HTTP_CONTENT_TYPES.applicationJson,
      },
    })
      .get(request.path)
      .reply(200, mockContent, {
        [HTTP_HEADERS.contentType]: HTTP_CONTENT_TYPES.textHtml,
      });

    const { result } = renderHook(() => useRequest(request));

    act(() => {
      result.current.trigger();
    });

    await waitFor(() => {
      const { response, loading } = result.current;
      expect(response).toBeDefined();
      expect(loading).toBeFalsy();
      expect(
        response && "statusCode" in response && response?.statusCode
      ).toEqual(200);

      expect(response && "body" in response && response?.body).toEqual(
        mockContent
      );

      expect(
        response && "contentType" in response && response.contentType
      ).toEqual("html");
    });
  });
});
