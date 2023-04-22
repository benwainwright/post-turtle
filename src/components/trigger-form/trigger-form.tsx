import { Box, Text, useApp } from "ink";
import Spinner from "ink-spinner";
import { HttpRequest } from "../../types/http-request.js";
import { useRequest } from "../../hooks/use-request/index.js";
import { FetchError } from "node-fetch";
import { highlight } from "cli-highlight";
import { RequestDetail } from "../request-detail/index.js";
import { Button } from "../button/index.js";
import { RequestFields } from "../request-fields/index.js";
import { useEffect } from "react";

interface TriggerFormProps {
  request: HttpRequest;
  nonInteractive?: boolean;
  onClose: () => void;
}

export const TriggerForm = ({
  request,
  onClose,
  nonInteractive,
}: TriggerFormProps) => {
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
          <RequestFields fields={fields} setFields={setFields} />
        </Box>
      </Box>
      <Box flexDirection="column">
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
                  <Text>{highlight(response.body, { language: "json" })}</Text>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>

      {!nonInteractive && (
        <Box marginTop={1}>
          <Button label="Trigger" onEnter={() => trigger()} />
          <Button label="Close" onEnter={onClose} />
        </Box>
      )}
    </Box>
  );
};
