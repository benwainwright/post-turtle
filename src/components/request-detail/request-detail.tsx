import { Box, Text } from "ink";
import { HttpRequest } from "../../types/http-request.js";
import { parseRequestFields } from "../../hooks/use-request/parse-request-fields.js";
import { hydrateRequest } from "../../hooks/use-request/hydrate-request.js";

interface RequestDetailProps {
  request: HttpRequest;
}

export const RequestDetail = ({ request }: RequestDetailProps) => {
  const hostFields = parseRequestFields(request).fields.host.map((field) => ({
    ...field,
    data: `{${field.name}}`,
  }));

  const pathFields = parseRequestFields(request).fields.path.map((field) => ({
    ...field,
    data: `{${field.name}}`,
  }));

  const neatRequest = hydrateRequest(request, {
    host: hostFields,
    path: pathFields,
    body: [],
    headers: {},
  });

  const pathString =
    !neatRequest.path || neatRequest.path.startsWith("/")
      ? neatRequest.path
      : `/${neatRequest.path}`;

  return (
    <Box flexDirection="column">
      <Box gap={2}>
        <Box flexGrow={2}>
          <Text bold color="blue">
            {request.title}
          </Text>
        </Box>

        <Box>
          <Text>{request.method}</Text>
        </Box>
        <Box width="70%">
          <Text>
            {neatRequest.host}
            {pathString}
          </Text>
        </Box>
      </Box>
      {request.headers && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color="blue">
            Headers
          </Text>
          {Object.entries(request.headers ?? {}).map(([id, value]) => (
            <Box key={`header-line-${id}`} flexDirection="row">
              <Text bold>{value.key}</Text>
              <Text>: </Text>
              <Text>{value.value}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
