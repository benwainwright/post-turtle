import { render } from "ink-testing-library";
import { HttpRequest } from "../../types/http-request.js";
import delay from "delay";
import { jest } from "@jest/globals";
import { EditRequestForm } from "./edit-request-form.js";

const exampleServerHost = `http://example-server.com`;

const arrowRight = "\u001B[C";

describe("<EditRequestForm />", () => {
  it("Allows you to edit the title", async () => {
    const onSave = jest.fn();
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const { stdin } = render(
      <EditRequestForm
        initialValue={request}
        onCancel={jest.fn()}
        onSave={onSave}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("Test title");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");

    expect(onSave).toHaveBeenCalledWith({ ...request, title: "fooTest title" });
  });

  it("Allows you to edit the slug", async () => {
    const onSave = jest.fn();
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const { stdin } = render(
      <EditRequestForm
        initialValue={request}
        onCancel={jest.fn()}
        onSave={onSave}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("Test slug");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");

    expect(onSave).toHaveBeenCalledWith({ ...request, slug: "fooTest slug" });
  });

  it("Allows you to edit the http method", async () => {
    const onSave = jest.fn();
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const { stdin } = render(
      <EditRequestForm
        initialValue={request}
        onCancel={jest.fn()}
        onSave={onSave}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write(arrowRight);
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");

    expect(onSave).toHaveBeenCalledWith({ ...request, method: "POST" });
  });

  it("Allows you to edit the host", async () => {
    const onSave = jest.fn();
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const { stdin } = render(
      <EditRequestForm
        initialValue={request}
        onCancel={jest.fn()}
        onSave={onSave}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("host-test");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");

    expect(onSave).toHaveBeenCalledWith({
      ...request,
      host: `${exampleServerHost}host-test`,
    });
  });

  it("triggers onCancel when you tab to it", async () => {
    const onCancel = jest.fn();
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const { stdin } = render(
      <EditRequestForm
        initialValue={request}
        onCancel={onCancel}
        onSave={jest.fn()}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");

    expect(onCancel).toHaveBeenCalled();
  });

  it("Allows you to edit the path", async () => {
    const onSave = jest.fn();
    const request: HttpRequest = {
      id: "foo",
      slug: "foo",
      title: "foo",
      method: "GET",
      host: exampleServerHost,
      path: "/path",
      headers: {
        "foo-header": {
          key: "bar",
          value: "baz",
        },
      },
    };
    const { stdin } = render(
      <EditRequestForm
        initialValue={request}
        onCancel={jest.fn()}
        onSave={onSave}
      />
    );

    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("path-test");
    await delay(20);
    stdin.write("\t");
    await delay(20);
    stdin.write("\r");

    expect(onSave).toHaveBeenCalledWith({
      ...request,
      path: `/pathpath-test`,
    });
  });
});
