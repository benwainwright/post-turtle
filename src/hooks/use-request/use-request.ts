import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import fetch, { FetchError } from "node-fetch";
import { normaliseRequest } from "../../core/normalise-request.js";

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
  const trigger = async () => {
    try {
      setLoading(true);

      const normalisedRequest = normaliseRequest(request);

      const url = `${normalisedRequest.host}/${normalisedRequest.path}`;
      const fetchResponse = await fetch(url, {
        method: normalisedRequest.method,
        body: normalisedRequest.body,
        headers: Object.fromEntries(
          Object.entries(normalisedRequest.headers ?? {}).map(([, value]) => [
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
        setLoading(false);
      }
    }
  };

  return { trigger, loading, response };
};
