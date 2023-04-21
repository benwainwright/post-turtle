import { HttpRequestWithFields } from "../../types/http-request-with-field.js";
import { HttpRequest } from "../../types/http-request.js";
import { parseRequestFields } from "./parse-request-fields.js";

describe("parse request fields", () => {
  it("returns the correct fields for the request", () => {
    const requests: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: "",
      path: "/{{ bim }}/id/{{ bash }}",
      headers: {
        authorization: {
          key: "thing",
          value: "other-thing",
        },
        "foo-header": {
          key: "bar",
          value: "baz-{{ Foo Bar }}-",
        },
      },
    };

    const result = parseRequestFields(requests);

    const expected: HttpRequestWithFields = {
      body: [],
      host: [],
      path: [
        {
          name: "bim",
          replace: "{{ bim }}",
          data: "",
        },
        {
          name: "bash",
          replace: "{{ bash }}",
          data: "",
        },
      ],
      headers: {
        authorization: [],
        "foo-header": [
          {
            name: "Foo Bar",
            replace: "{{ Foo Bar }}",
            data: "",
          },
        ],
      },
    };

    expect(result.fields).toStrictEqual(expected);
    expect(result.hasFields).toEqual(true);
  });

  it("returns hasFields false if there aren't any fields", () => {
    const requests: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: "",
      path: "/boop/",
      headers: {
        authorization: {
          key: "thing",
          value: "other-thing",
        },
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };

    const result = parseRequestFields(requests);

    expect(result.hasFields).toEqual(false);
  });
});
