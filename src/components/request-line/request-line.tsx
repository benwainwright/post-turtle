import { useInput, Box, Text, useFocus } from "ink";
import { HttpRequest } from "../../types/http-request.js";
import { useRequest } from "../../hooks/use-request/use-request.js";
import Spinner from "ink-spinner";
import { FetchError } from "node-fetch";

interface RequestLineProps {
  request: HttpRequest;
  onTriggerEdit: () => void;
}

export const RequestLine = (props: RequestLineProps) => {
  const { isFocused } = useFocus();
  const { loading, trigger, response } = useRequest(props.request);

  useInput(async (char) => {
    if (char === "e" && isFocused) {
      props.onTriggerEdit();
    }

    if (char === "t" && isFocused) {
      await trigger();
    }
  });

  const pathString = props.request.path ? `/${props.request.path}` : ``;
  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={isFocused ? "blue" : "white"}
    >
      <Box flexDirection="column">
        <Box gap={2}>
          <Text bold color="blue">
            {props.request.title}
          </Text>
          <Text>{props.request.method}</Text>
          <Text>
            {props.request.host}
            {pathString}
          </Text>
        </Box>
        {props.request.headers && (
          <Box marginTop={1} flexDirection="column">
            {Object.entries(props.request.headers ?? {}).map(([id, value]) => (
              <Box key={`header-line-${id}`} flexDirection="row">
                <Text bold>{value.key}</Text>
                <Text>: </Text>
                <Text>{value.value}</Text>
              </Box>
            ))}
          </Box>
        )}
        {loading && (
          <Box>
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
                <Box>
                  <Text bold>Status Code: </Text>
                  <Text>{response.statusCode}</Text>
                </Box>
                <Box>
                  <Text bold>Body: </Text>
                  <Text backgroundColor="grey" color="black">
                    {response.body}
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
