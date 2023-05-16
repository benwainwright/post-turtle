import { useInput, Text, Box } from "ink";
import { v4 } from "uuid";
import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import { EditRequestForm } from "../edit-request-form/index.js";
import { DEFAULT_REQUEST } from "../../core/default-request.js";
import { RequestList } from "../request-list/request-list.js";
import { useStorage } from "../../hooks/use-storage/use-storage.js";
import { normaliseRequest } from "../../core/normalise-request.js";
import { defaultDatafile } from "../../core/default-data-file-path.js";
import { TriggerForm } from "../trigger-form/index.js";
import { ConfirmDialog } from "../confirm-dialog/confirm-dialog.js";

interface AppProps {
  dataFile?: string;
}

export const App = ({ dataFile }: AppProps) => {
  const storageResult = useStorage<HttpRequest[]>(
    dataFile ?? defaultDatafile()
  );

  const [editRequest, setEditRequest] = useState<HttpRequest | undefined>();
  const [triggerForm, setTriggerForm] = useState<HttpRequest | undefined>();
  const [deleteRequest, setDeleteRequest] = useState<HttpRequest | undefined>();

  const dialogVisible = editRequest || triggerForm || deleteRequest;

  useInput((char) => {
    if (char === "a" && !dialogVisible) {
      setEditRequest({ ...DEFAULT_REQUEST, id: v4() });
    }
  });

  if (!storageResult.loaded) {
    return <Text>Loading requests from disk</Text>;
  }

  if (triggerForm) {
    return (
      <TriggerForm
        request={triggerForm}
        onClose={() => setTriggerForm(undefined)}
      />
    );
  }

  const { content: requests, update } = storageResult;

  if (deleteRequest) {
    return (
      <ConfirmDialog
        message="Are you sure you want to delete this request?"
        onCancel={() => setDeleteRequest(undefined)}
        onOk={() => {
          const index = requests.findIndex(
            (needle) => needle.id === deleteRequest.id
          );
          const newRequests = Array.from(requests);
          newRequests.splice(index, 1);
          update(newRequests);
          setDeleteRequest(undefined);
        }}
      />
    );
  }

  if (editRequest) {
    return (
      <EditRequestForm
        initialValue={editRequest}
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
        onTriggerDelete={(request) => {
          if (!dialogVisible) {
            setDeleteRequest(request);
          }
        }}
        onTriggerEdit={(request) => {
          if (!dialogVisible) {
            setEditRequest(request);
          }
        }}
        onShowTriggerDialog={(request) => {
          if (!dialogVisible) {
            setTriggerForm(request);
          }
        }}
      />
    </>
  );
};
