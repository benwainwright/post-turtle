import { EventEmitter } from "events";

import { render } from "ink";
import { App } from "../components/app/index.js";
import { program } from "@commander-js/extra-typings";
import { loadData } from "./load-data.js";
import { getPackageJson } from "./get-package-json.js";
import { parseRequestFields } from "../hooks/use-request/parse-request-fields.js";
import {
  Field,
  HttpRequestWithFields,
} from "../types/http-request-with-field.js";
import { normaliseRequest } from "./normalise-request.js";
import { hydrateRequest } from "../hooks/use-request/hydrate-request.js";
import { TriggerForm } from "../components/trigger-form/index.js";

export const buildCli = async () => {
  EventEmitter.defaultMaxListeners = 170;

  const packageJson = await getPackageJson();

  program
    .option("-c, --config <path>")
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version);

  program.action(() => {
    render(<App />);
  });

  const call = program
    .command("call")
    .description(
      `Call HTTP request. To edit this list of commands interactively, run ${packageJson.name} without any arguments`
    );

  const data = await loadData();
  data.forEach((request) => {
    const fields = parseRequestFields(request);
    const command = call
      .command<string>(request.slug)
      .description(request.title);

    const addFieldsOption = (field: Field) => {
      command.requiredOption(
        `--${field.name} <${field.name}>`,
        field.description
      );
    };

    fields.fields.body.forEach(addFieldsOption);
    fields.fields.path.forEach(addFieldsOption);
    fields.fields.host.forEach(addFieldsOption);
    Object.values(fields.fields.headers).forEach((header) => {
      header.forEach(addFieldsOption);
    });

    command.action((options) => {
      const hydrated: HttpRequestWithFields = {
        body: fields.fields.body.map((field) => ({
          ...field,
          data: options[field.name] ?? field.data,
        })),

        host: fields.fields.host.map((field) => ({
          ...field,
          data: options[field.name] ?? field.data,
        })),

        path: fields.fields.path.map((field) => ({
          ...field,
          data: options[field.name] ?? field.data,
        })),
        headers: Object.fromEntries(
          Object.entries(fields.fields.headers).map(([id, fields]) => [
            id,
            fields.map((field) => ({
              ...field,
              data: options[field.name] ?? field.data,
            })),
          ])
        ),
      };

      const finalRequest = normaliseRequest(hydrateRequest(request, hydrated));
      render(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <TriggerForm request={finalRequest} nonInteractive onClose={() => {}} />
      );
    });
  });
  return program;
};
