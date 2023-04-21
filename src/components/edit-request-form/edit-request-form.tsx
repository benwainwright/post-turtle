import { useState } from "react";
import { HttpRequest } from "../../types/http-request.js";
import { Input } from "../input/input.js";
import { Button } from "../button/button.js";
import { Box } from "ink";
import { Select } from "../select/index.js";
import { HTTP_METHODS } from "../../core/http-methods.js";
import { HttpMethod } from "../../types/http-method.js";
import { KeyValueAddField } from "../key-value-add-field/index.js";

interface EditRequestFormProps {
  initalValue: HttpRequest;
  onSave: (request: HttpRequest) => void;
  onCancel: () => void;
}

export const EditRequestForm = ({
  onSave,
  onCancel,
  initalValue,
}: EditRequestFormProps) => {
  const [request, setRequest] = useState(initalValue);

  return (
    <>
      <Input
        label="Title"
        value={request.title}
        onChange={(title) => setRequest({ ...request, title })}
      />
      <Input
        label="Slug"
        value={request.slug}
        onChange={(slug) => setRequest({ ...request, slug })}
      />
      <Select
        label="Method"
        options={HTTP_METHODS}
        value={request.method}
        onChange={(method) =>
          setRequest({ ...request, method: method as HttpMethod })
        }
      />
      <Input
        label="Host"
        value={request.host}
        onChange={(host) => setRequest({ ...request, host })}
      />

      <KeyValueAddField
        label="Headers"
        fieldValue={request.headers}
        onChange={(headers) => setRequest({ ...request, headers })}
      />

      <Input
        label="Path"
        value={request.path}
        onChange={(path) => setRequest({ ...request, path })}
      />
      <Box>
        <Button label="Submit" onEnter={() => onSave(request)} />
        <Button label="Cancel" onEnter={() => onCancel()} />
      </Box>
    </>
  );
};
