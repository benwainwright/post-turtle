import { Box } from "ink";
import { HttpRequestWithFields } from "../../types/http-request-with-field.js";
import { Input } from "../input/input.js";

interface RequestFieldsProps {
  setFields: (fields: HttpRequestWithFields) => void;
  fields: HttpRequestWithFields;
}

export const RequestFields = ({ fields, setFields }: RequestFieldsProps) => {
  return (
    <>
      {fields.host.map((hostField, index) => (
        <Input
          key={`host-${hostField.name}`}
          label={hostField.name}
          value={hostField.data}
          onChange={(value) => {
            const newHost = Array.from(fields.host);
            newHost[index].data = value;
            setFields({ ...fields, host: newHost });
          }}
        />
      ))}
      {fields.body.map((bodyField, index) => (
        <Input
          key={`body-${bodyField.name}`}
          label={bodyField.name}
          value={bodyField.data}
          onChange={(value) => {
            const newBody = Array.from(fields.body);
            newBody[index].data = value;
            setFields({ ...fields, body: newBody });
          }}
        />
      ))}
      {fields.path.map((pathField, index) => (
        <Input
          key={`path-${pathField.name}`}
          label={pathField.name}
          value={pathField.data}
          onChange={(value) => {
            const newPath = Array.from(fields.path);
            newPath[index].data = value;
            setFields({ ...fields, path: newPath });
          }}
        />
      ))}
      {Object.entries(fields.headers ?? {}).flatMap(([key, value]) => {
        return value.map((headerField, index) => (
          <Input
            key={`body-${headerField.name}`}
            label={headerField.name}
            value={headerField.data}
            onChange={(value) => {
              const newHeaderFields = Array.from(fields.headers[key]);
              newHeaderFields[index].data = value;
              setFields({
                ...fields,
                headers: { ...fields.headers, [key]: newHeaderFields },
              });
            }}
          />
        ));
      })}
    </>
  );
};
