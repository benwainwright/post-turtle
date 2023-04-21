#!/usr/bin/env node

import { render } from "ink";
import { App } from "./components/app/index.js";
import { program } from "commander";
import { loadData } from "./core/load-data.js";
import { RequestLine } from "./components/request-line/index.js";
import { getPackageJson } from "./core/get-package-json.js";

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
    "Call saved HTTP request. To edit this list of commands interactively, run api-tester without any arguments"
  );

const data = await loadData();
data.forEach((request) =>
  call
    .command(request.slug)
    .description(request.title)
    .action(() => {
      render(<RequestLine request={request} immediateTrigger />);
    })
);

program.parse();
