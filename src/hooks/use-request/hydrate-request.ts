import {
  Field,
  HttpRequestWithFields,
} from "../../types/http-request-with-field.js";
import { HttpRequest } from "../../types/http-request.js";

const hydrateStringWithFields = (text: string, fields?: Field[]) =>
  fields?.reduce(
    (text, field) => text.replace(field.replace, field.data),
    text
  ) ?? "";

export const hydrateRequest = (
  request: HttpRequest,
  requestFields: HttpRequestWithFields
) => {
  return {
    ...request,
    host: hydrateStringWithFields(request.host, requestFields.host),
    body:
      request.body && hydrateStringWithFields(request.body, requestFields.body),
    path: hydrateStringWithFields(request.path, requestFields.path),
    headers:
      request.headers &&
      Object.fromEntries(
        Object.entries(request.headers).map(([key, value]) => [
          key,
          {
            ...value,
            value: hydrateStringWithFields(
              value.value,
              requestFields.headers[key]
            ),
          },
        ])
      ),
  };
};
