import {
  HttpRequestWithFields,
  Field,
} from "../../types/http-request-with-field.js";
import { HttpRequest } from "../../types/http-request.js";

type RegexMatches = string[] & { index: number };

const getFieldsFromString = (text: string) => {
  const regex = /{{\s*(\w|\w\w|\w[\w\s\w]+\w)\s*}}/gm;
  const fields: Field[] = [];
  let match: RegexMatches | null = null;
  do {
    match = regex.exec(text);
    if (match) {
      fields.push({
        replace: match[0],
        name: match[1],
        data: "",
      });
    }
  } while (match !== null);

  return fields;
};

export const parseRequestFields = (
  request: HttpRequest
): { fields: HttpRequestWithFields; hasFields: boolean } => {
  const body = getFieldsFromString(request.body ?? "");
  const host = getFieldsFromString(request.host);
  const path = getFieldsFromString(request.path);
  const headers = Object.fromEntries(
    Object.entries(request.headers ?? {}).map(([key, value]) => [
      key,
      getFieldsFromString(value.value),
    ])
  );

  const hasHeaders = Boolean(
    Object.entries(headers).find(([, value]) => value.length > 0)
  );

  return {
    hasFields:
      body.length > 0 || host.length > 0 || path.length > 0 || hasHeaders,

    fields: {
      body,
      host,
      path,
      headers,
    },
  };
};