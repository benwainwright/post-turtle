import { Text } from "ink";
import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import { RequestLine } from "../request-line/request-line.js";

export const App = () => {
  const [requests, setRequests] = useState<HttpRequest[]>([]);

  if (requests.length === 0) {
    return (
      <Text>You've not created any requests. Press enter to get started!</Text>
    );
  }

  return requests.map((request) => <RequestLine request={request} />);
};
