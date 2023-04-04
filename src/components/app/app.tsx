import { useInput, Text } from "ink";
import { v4 } from "uuid";
import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import { EditRequestForm } from "../edit-request-form/edit-request-form.js";
import { DEFAULT_REQUEST } from "../../core/default-request.js";
import { RequestList } from "../request-list/request-list.js";
import path from "node:path";
import { useStorage } from "../../hooks/use-storage/use-storage.js";
import { normaliseRequest } from "../../core/normalise-request.js";

const dataFile = path.join(process.cwd(), "requests.json");

export const App = () => {
  const storageResult = useStorage<HttpRequest[]>(dataFile);

  const [editRequest, setEditRequest] = useState<HttpRequest | undefined>();

  useInput((_, key) => {
    if (key.return && !editRequest) {
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
            const newRequests = [...requests];
            newRequests[index] = request;
            update(newRequests);
          }
          setEditRequest(undefined);
        }}
      />
    );
  }

  return (
    <RequestList
      requests={requests}
      onTriggerEdit={(request) => setEditRequest(request)}
    />
  );
};
