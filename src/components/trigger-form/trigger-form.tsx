import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { HttpRequest } from "../../types/http-request.js";
import { Input } from "../input/index.js";
import { useRequest } from "../../hooks/use-request/index.js";
import { FetchError } from "node-fetch";
import { highlight } from "cli-highlight";
import { RequestDetail } from "../request-detail/index.js";
import { Button } from "../button/index.js";

interface TriggerFormProps {
  request: HttpRequest;
  onClose: () => void;
}

export const TriggerForm = ({ request, onClose }: TriggerFormProps) => {
  const {
    fields,
    setFields,
    loading,
    response,
    finalRequest,
    fieldsEdited,
    trigger,
  } = useRequest(request);

  return (
    <Box borderStyle="single" flexDirection="column">
      <RequestDetail request={fieldsEdited ? finalRequest : request} />
      <Box marginTop={1} flexDirection="column">
        <Text bold color="blue">
          Fields
        </Text>
        <Box flexDirection="column">
          {fields.host.map((hostField, index) => (
            <Input
              key={`host-${hostField.name}`}
              label={hostField.name}
              value={hostField.data}
              onChange={(value) => {
                const newHost = Array.from(fields.host);
                newHost[index].data = value;
                setFields({ ...fields, host: newHost });
              }}
            />
          ))}
          {fields.body.map((bodyField, index) => (
            <Input
              key={`body-${bodyField.name}`}
              label={bodyField.name}
              value={bodyField.data}
              onChange={(value) => {
                const newBody = Array.from(fields.body);
                newBody[index].data = value;
                setFields({ ...fields, body: newBody });
              }}
            />
          ))}
          {fields.path.map((pathField, index) => (
            <Input
              key={`path-${pathField.name}`}
              label={pathField.name}
              value={pathField.data}
              onChange={(value) => {
                const newPath = Array.from(fields.path);
                newPath[index].data = value;
                setFields({ ...fields, path: newPath });
              }}
            />
          ))}
          {Object.entries(fields.headers ?? {}).flatMap(([key, value]) => {
            return value.map((headerField, index) => (
              <Input
                key={`body-${headerField.name}`}
                label={headerField.name}
                value={headerField.data}
                onChange={(value) => {
                  const newHeaderFields = Array.from(fields.headers[key]);
                  newHeaderFields[index].data = value;
                  setFields({
                    ...fields,
                    headers: { ...fields.headers, [key]: newHeaderFields },
                  });
                }}
              />
            ));
          })}

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
        </Box>
      </Box>
      <Box flexDirection="column">
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
                  <Text>{highlight(response.body, { language: "json" })}</Text>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>

      <Box>
        <Button label="Trigger" onEnter={() => trigger()} />
        <Button label="Close" onEnter={onClose} />
      </Box>
    </Box>
  );
};
