import { Box, Text } from "ink";
import { HttpRequest } from "../../types/http-request.js";

interface RequestDetailProps {
  request: HttpRequest;
}

export const RequestDetail = ({ request }: RequestDetailProps) => {
  const pathString = request.path ? `/${request.path}` : ``;
  return (
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
    </Box>
  );
};
