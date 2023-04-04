import { HttpRequest } from "../../types/http-request.js";
import { Text } from "ink";
import { RequestLine } from "../request-line/index.js";

interface RequestListProps {
  requests: HttpRequest[];
  onTriggerEdit: (request: HttpRequest) => void;
}
export const RequestList = ({ requests, onTriggerEdit }: RequestListProps) => {
  if (requests.length === 0) {
    return (
      <Text>You've not created any requests. Press enter to get started!</Text>
    );
  }

  return (
    <>
      {requests.map((request) => (
        <RequestLine
          key={request.id}
          request={request}
          onTriggerEdit={() => {
            onTriggerEdit(request);
          }}
        />
      ))}
    </>
  );
};
