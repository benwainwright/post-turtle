import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import fetch, { FetchError } from "node-fetch";
import { normaliseRequest } from "../../core/normalise-request.js";
import { parseRequestFields } from "../../components/request-line/parse-request-fields.js";
import { hydrateRequest } from "./hydrate-request.js";
import { HttpRequestWithFields } from "../../types/http-request-with-field.js";

interface SimpleResponse {
  statusCode: number;
  body: string;
}

const formatJson = (text: string) => JSON.stringify(JSON.parse(text), null, 2);

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

      const url = `${finalRequest.host}/${finalRequest.path}`;
      const fetchResponse = await fetch(url, {
        method: finalRequest.method,
        body: finalRequest.body,
        headers: Object.fromEntries(
          Object.entries(finalRequest.headers ?? {}).map(([, value]) => [
            value.key,
            value.value,
          ])
        ),
      });
      const body = formatJson(await fetchResponse.text());
      setResponse({ statusCode: fetchResponse.status, body });
      setLoading(false);
    } catch (error) {
      if (error instanceof FetchError) {
        setResponse(error);
      }
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
