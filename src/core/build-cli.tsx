import { EventEmitter } from "events";

import { Command } from "commander";
import { loadData } from "./load-data.js";
import { getPackageJson } from "./get-package-json.js";
import { parseRequestFields } from "../hooks/use-request/parse-request-fields.js";
import {
  Field,
  HttpRequestWithFields,
} from "../types/http-request-with-field.js";
import { normaliseRequest } from "./normalise-request.js";
import { hydrateRequest } from "../hooks/use-request/hydrate-request.js";
import { generateCompletionsScript } from "./generate-completions-script.js";
import { renderApp } from "./render-app.js";
import { renderTriggerForm } from "./render-trigger-form.js";

export const buildCli = async () => {
  EventEmitter.defaultMaxListeners = 170;

  const packageJson = await getPackageJson();

  const program = new Command();

  const name = Object.keys(packageJson.bin)[0];

  program
    .name(name)
    .description(`post-turtle: ${packageJson.description}`)
    .version(packageJson.version)
    .addHelpText(
      "after",
      `\nTo edit saved HTTP requests interactively, run ${name} without arguments`
    );

  program.action(async () => {
    await renderApp();
  });

  const call = program.command("call").description(`call saved HTTP request`);

  const data = await loadData();

  program
    .command("completion")
    .description("generate ZSH completion script")
    // eslint-disable-next-line no-console
    .action(() => console.log(generateCompletionsScript(data)));

  data.forEach((request) => {
    const fields = parseRequestFields(request);
    const command = call.command(request.slug).description(request.title);

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

    command.action(async (options) => {
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
      await renderTriggerForm(finalRequest);
    });
  });
  return program;
};
