import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import fetch, { FetchError } from "node-fetch";
import { normaliseRequest } from "../../core/normalise-request.js";
import { parseRequestFields } from "./parse-request-fields.js";
import { hydrateRequest } from "./hydrate-request.js";
import { HttpRequestWithFields } from "../../types/http-request-with-field.js";

type ContentType = "html" | "json" | "text";

const getContentType = (header: Headers): ContentType => {
  const contentTypeHeaderValue = header.get("content-type");
  if (contentTypeHeaderValue?.includes("application/json")) {
    return "json";
  }

  if (contentTypeHeaderValue?.includes("text/html")) {
    return "html";
  }

  return "text";
};

interface SimpleResponse {
  statusCode: number;
  body: string;
  headers: Headers;
  contentType: ContentType;
}

const formatResponse = (text: string) => {
  const trimmedLines = text
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .map((line) => line.replace(/\t/g, "  "))
    .join("\n");

  try {
    return JSON.stringify(JSON.parse(trimmedLines), null, 2);
  } catch {
    return trimmedLines;
  }
};

export const useRequest = (request: HttpRequest) => {
  const [response, setResponse] = useState<
    SimpleResponse | FetchError | undefined
  >();
  const [loading, setLoading] = useState(false);
  const { fields: parsedFields, hasFields } = parseRequestFields(request);
  const [fields, setFields] = useState(parsedFields);
  const [fieldsEdited, setFieldsEdited] = useState(false);

  const finalRequest = normaliseRequest(hydrateRequest(request, fields));

  const trigger = async () => {
    try {
      setLoading(true);

      const headers = Object.fromEntries(
        Object.entries(finalRequest.headers ?? {}).map(([, value]) => [
          value.key,
          value.value,
        ])
      );

      const url = `${finalRequest.host}/${finalRequest.path}`;
      const fetchResponse = await fetch(url, {
        method: finalRequest.method,
        body: finalRequest.body,
        headers,
      });

      const body = formatResponse(await fetchResponse.text());
      setResponse({
        statusCode: fetchResponse.status,
        body,
        contentType: getContentType(fetchResponse.headers),
        headers: fetchResponse.headers,
      });
      setLoading(false);
    } catch (error) {
      /**
       * If I don't do this type assertion I get coverage issues on the else branch.
       * TODO rethrow error and write tests for that case
       */
      setResponse(error as FetchError);
      setLoading(false);
    }
  };

  return {
    trigger,
    loading,
    response,
    fields,
    finalRequest,
    fieldsEdited,
    setFields: (fields: HttpRequestWithFields) => {
      if (!fieldsEdited) {
        setFieldsEdited(true);
      }
      setFields(fields);
    },
    hasFields,
  };
};
