import { HttpRequest } from "../types/http-request.js";

export const generateCompletionsScript = (requests: HttpRequest[]) => {
  return `
_pt_completions() {
  _arguments -C \\
    "1: :(call)" \\
    "*::arg:->args"

  case $line[1] in
    call)
      _pt_call
    ;;
  esac
}

_pt_call() {
  _arguments \\
    "1: :(${requests.map((mappedRequest) => mappedRequest.slug).join(" ")})" \\
    "*::arg:->args"
}

compdef _pt_completions pt
`;
};
