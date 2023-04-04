import { Text } from "ink";
import { HttpRequest } from "../../types/http-request.js";

interface RequestLineProps {
  request: HttpRequest;
}

export const RequestLine = (props: RequestLineProps) => {
  return <Text>{props.request.title}</Text>;
};
