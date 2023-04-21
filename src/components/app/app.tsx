import { useInput, Text, Box } from "ink";
import { v4 } from "uuid";
import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import { EditRequestForm } from "../edit-request-form/edit-request-form.js";
import { DEFAULT_REQUEST } from "../../core/default-request.js";
import { RequestList } from "../request-list/request-list.js";
import { useStorage } from "../../hooks/use-storage/use-storage.js";
import { normaliseRequest } from "../../core/normalise-request.js";
import { defaultDatafile } from "../../core/default-data-file-path.js";

interface AppProps {
  dataFile?: string;
}

export const App = ({ dataFile }: AppProps) => {
  const storageResult = useStorage<HttpRequest[]>(
    dataFile ?? defaultDatafile()
  );

  const [editRequest, setEditRequest] = useState<HttpRequest | undefined>();

  useInput((char) => {
    if (char === "a" && !editRequest) {
      setEditRequest({ ...DEFAULT_REQUEST, id: v4() });
    }
  });

  if (!storageResult.loaded) {
    return <Text>Loading requests from disk</Text>;
  }

  const { content: requests, update } = storageResult;

  if (editRequest) {
    return (
      <EditRequestForm
        initalValue={editRequest}
        onCancel={() => {
          setEditRequest(undefined);
        }}
        onSave={(incomingRequest) => {
          const request = normaliseRequest(incomingRequest);
          const index = requests.findIndex(
            (nextRequest) => request.id === nextRequest.id
          );

          if (index === -1) {
            update([...requests, request]);
          } else {
            const newRequests = Array.from(requests);
            newRequests[index] = request;
            update(newRequests);
          }
          setEditRequest(undefined);
        }}
      />
    );
  }

  const helpText =
    requests.length === 0 ? (
      <Text bold>
        You&apos;ve not created any requests. Press &apos;a&apos; to get
        started!
      </Text>
    ) : (
      <Text bold>
        Press &apos;a&apos; to create a new request, &apos;e&apos; to edit a
        request or &apos;d&apos; to delete a request
      </Text>
    );

  return (
    <>
      <Box marginTop={1}>{helpText}</Box>
      <RequestList
        requests={requests}
        onTriggerEdit={(request) => setEditRequest(request)}
      />
    </>
  );
};
