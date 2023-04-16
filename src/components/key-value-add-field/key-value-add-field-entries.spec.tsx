import { KeyValueAddFieldEntries } from "./key-value-add-field-entries.js";
import { render } from "ink-testing-library";
import { jest } from "@jest/globals";

describe("<KeyValueAddFieldRow />", () => {
  it("is editable when you tab to it", () => {
    const values = {
      [`test-id`]: { key: "header-name", value: "header-value" },
      [`test-id-2`]: { key: "another-header", value: "its-value" },
    };

    const onChange = jest.fn();

    const { stdin } = render(
      <KeyValueAddFieldEntries fieldValue={values} onChange={onChange} />
    );

    stdin.write("\t\t\t\r3");

    const expectedNewValues = {
      [`test-id`]: { key: "header-name", value: "header-value" },
      [`test-id-23`]: { key: "another-header", value: "its-value" },
    };

    expect(onChange).toBeCalledWith(expectedNewValues);
  });
});
