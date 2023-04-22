import { HttpRequest } from "../../types/http-request.js";
import { RequestLine } from "../request-line/index.js";

interface RequestListProps {
  requests: HttpRequest[];
  onTriggerDelete: (request: HttpRequest) => void;
  onTriggerEdit: (request: HttpRequest) => void;
  onShowTriggerDialog: (request: HttpRequest) => void;
}
export const RequestList = ({
  requests,
  onTriggerEdit,
  onTriggerDelete,
  onShowTriggerDialog,
}: RequestListProps) => {
  return (
    <>
      {requests.map((request) => (
        <RequestLine
          key={request.id}
          request={request}
          onTriggerDelete={() => {
            onTriggerDelete(request);
          }}
          onShowTriggerDialog={() => {
            onShowTriggerDialog(request);
          }}
          onTriggerEdit={() => {
            onTriggerEdit(request);
          }}
        />
      ))}
    </>
  );
};
