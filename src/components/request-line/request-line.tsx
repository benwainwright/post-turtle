import { useInput, Box, Text, useFocus, useApp } from "ink";
import { HttpRequest } from "../../types/http-request.js";
import { useRequest } from "../../hooks/use-request/use-request.js";
import Spinner from "ink-spinner";
import { FetchError } from "node-fetch";
import { useEffect } from "react";
import { normaliseRequest } from "../../core/normalise-request.js";
import { highlight } from "cli-highlight";

interface RequestLineProps {
  request: HttpRequest;
  onTriggerEdit?: () => void;
  immediateTrigger?: boolean;
}

export const RequestLine = ({
  request: rawRequest,
  onTriggerEdit,
  immediateTrigger,
}: RequestLineProps) => {
  const { isFocused } = useFocus();
  const request = normaliseRequest(rawRequest);
  const { loading, trigger, response } = useRequest(request);
  const { exit } = useApp();

  useInput(async (char) => {
    if (char === "e" && isFocused) {
      onTriggerEdit?.();
    }

    if (char === "t" && isFocused) {
      await trigger();
    }
  });

  useEffect(() => {
    (async () => {
      if (immediateTrigger) {
        await trigger();
        exit();
      }
    })();
  }, []);

  const pathString = request.path ? `/${request.path}` : ``;
  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={isFocused ? "blue" : "white"}
    >
      <Box flexDirection="column">
        <Box gap={2}>
          <Text bold color="blue">
            {request.title}
          </Text>
          <Text>{request.method}</Text>
          <Text>
            {request.host}
            {pathString}
          </Text>
        </Box>
        {request.headers && (
          <Box marginTop={1} flexDirection="column">
            {Object.entries(request.headers ?? {}).map(([id, value]) => (
              <Box key={`header-line-${id}`} flexDirection="row">
                <Text bold>{value.key}</Text>
                <Text>: </Text>
                <Text>{value.value}</Text>
              </Box>
            ))}
          </Box>
        )}
        {loading && (
          <Box marginTop={1}>
            <Text>
              <Text color="green">
                <Spinner type="dots" />
              </Text>
              {" Loading"}
            </Text>
          </Box>
        )}

        {response && (
          <Box marginTop={1} flexDirection="column">
            <Text bold color="blue">
              Response
            </Text>
            {response && !(response instanceof FetchError) && (
              <>
                <Box marginBottom={1} flexDirection="column">
                  <Text bold>Status Code</Text>
                  <Text>{response.statusCode}</Text>
                </Box>
                <Box flexDirection="column">
                  <Text>
                    {/* eslint-disable-next-line import/no-named-as-default-member */}
                    {highlight(response.body, { language: "json" })}
                  </Text>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
