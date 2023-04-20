import { normaliseRequest } from "./normalise-request.js";
import { mock } from "jest-mock-extended";
import { HttpRequest } from "../types/http-request.js";

describe("normalise request", () => {
  it("removes leading slash from the path", () => {
    const request = mock<HttpRequest>({
      path: `/foo/bar`,
      host: `foo`,
    });

    const result = normaliseRequest(request);
    expect(result.path).toEqual(`foo/bar`);
  });

  it("Leaves path the same if there is no leading slash", () => {
    const request = mock<HttpRequest>({
      path: `foo/bar`,
      host: `foo`,
    });

    const result = normaliseRequest(request);
    expect(result.path).toEqual(`foo/bar`);
  });

  it("Removes trailing slash from host if there is one", () => {
    const request = mock<HttpRequest>({
      host: `http://www.google.com/`,
      path: `foo`,
    });

    const result = normaliseRequest(request);
    expect(result.host).toEqual(`http://www.google.com`);
  });

  it("Leaves host the same if there is no trailing slash", () => {
    const request = mock<HttpRequest>({
      host: `http://www.google.com`,
      path: `foo`,
    });

    const result = normaliseRequest(request);
    expect(result.host).toEqual(`http://www.google.com`);
  });

  it("passes through other properties as is", () => {
    const request: HttpRequest = {
      host: `http://www.google.com`,
      path: `foo`,
      id: "foo",
      title: "foo",
      body: "foo",
      method: "GET",
      headers: {},
      slug: "bar",
    };

    const result = normaliseRequest(request);
    expect(result).toEqual(request);
  });
});
