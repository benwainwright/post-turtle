import { HTTP_CONTENT_TYPES, HTTP_HEADERS } from "../../core/constants.js";
import { HttpRequest } from "../../types/http-request.js";
import { hydrateRequest } from "./hydrate-request.js";
import { HttpRequestWithFields } from "../../types/http-request-with-field.js";

describe("hydrate request", () => {
  it("correctly hydrates data back into the original object when there are params in the body", () => {
    const exampleServerHost = `http://example-server.com`;

    const fields: HttpRequestWithFields = {
      body: [
        {
          name: "param",
          replace: "{{ param }}",
          data: "with some data and",
          description: "foo",
        },
      ],
      host: [],
      path: [],
      headers: {
        "bar-header": [],
        "foo-header": [],
      },
    };

    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      body: `foo body {{ param }} with some text`,
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
    const hydrated = hydrateRequest(request, fields);

    expect(hydrated.body).toEqual(`foo body with some data and with some text`);
  });

  it("correctly hydrates data back into the original object when there are params in the host", () => {
    const exampleServerHost = `http://example-server.com`;

    const fields: HttpRequestWithFields = {
      body: [],
      host: [
        {
          name: "id",
          replace: "{{ id }}",
          data: "43",
          description: "foo",
        },
      ],
      path: [],
      headers: {
        "bar-header": [],
        "foo-header": [],
      },
    };

    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      body: `foo body with some text`,
      host: `${exampleServerHost}/{{ id }}/something`,
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
    const hydrated = hydrateRequest(request, fields);

    expect(hydrated.host).toEqual(`${exampleServerHost}/43/something`);
  });

  it("correctly hydrates data back into the original object when there are params in the path", () => {
    const exampleServerHost = `http://example-server.com`;

    const fields: HttpRequestWithFields = {
      body: [],
      host: [],
      path: [
        {
          name: "id",
          replace: "{{ id }}",
          data: "43",
          description: "foo",
        },
      ],
      headers: {
        "bar-header": [],
        "foo-header": [],
      },
    };

    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      body: `foo body with some text`,
      host: exampleServerHost,
      path: "/path/{{ id }}/something",
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
    const hydrated = hydrateRequest(request, fields);

    expect(hydrated.path).toEqual(`/path/43/something`);
  });

  it("correctly hydrates data back into the original object when there are params in header values", () => {
    const exampleServerHost = `http://example-server.com`;

    const fields: HttpRequestWithFields = {
      body: [],
      host: [],
      path: [],
      headers: {
        "foo-header": [
          {
            name: "param",
            replace: "{{ param }}",
            data: "another",
            description: "foo",
          },
        ],
        "bar-header": [],
      },
    };

    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      body: `foo body with some text`,
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz {{ param }} value",
        },
        "bar-header": {
          key: HTTP_HEADERS.contentType,
          value: HTTP_CONTENT_TYPES.applicationJson,
        },
      },
    };
    const hydrated = hydrateRequest(request, fields);

    expect(hydrated.headers?.[`foo-header`].value).toEqual(`baz another value`);
  });
});
