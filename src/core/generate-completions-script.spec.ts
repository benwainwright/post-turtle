import { HttpRequest } from "../types/http-request.js";
import { generateCompletionsScript } from "./generate-completions-script.js";
describe("generateCompletionsScript", () => {
  it("generates the correct completions script given some http requests", () => {
    const requests: HttpRequest[] = [
      {
        id: "foo",
        slug: "foo",
        title: "foo",
        method: "GET",
        host: "foo",
        path: "/path",
        headers: {
          "foo-header": {
            key: "bar",
            value: "baz",
          },
        },
      },
      {
        id: "foo-bar",
        slug: "foo-bar",
        title: "Foobar",
        method: "POST",
        host: "bar",
        path: "/another/path",
      },
    ];

    const result = generateCompletionsScript(requests);

    const expected = `
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
    "1: :(foo foo-bar)" \\
    "*::arg:->args"
}

compdef _pt_completions pt
    `;

    expect(result.trim()).toEqual(expected.trim());
  });
});
