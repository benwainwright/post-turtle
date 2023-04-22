import { HttpRequest } from "../../types/http-request.js";
import { RequestLine } from "../request-line/index.js";

interface RequestListProps {
  requests: HttpRequest[];
  onTriggerEdit: (request: HttpRequest) => void;
  onShowTriggerDialog: (request: HttpRequest) => void;
}
export const RequestList = ({
  requests,
  onTriggerEdit,
  onShowTriggerDialog,
}: RequestListProps) => {
  return (
    <>
      {requests.map((request) => (
        <RequestLine
          key={request.id}
          request={request}
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
