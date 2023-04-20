#!/usr/bin/env node

import { render } from "ink";
import { App } from "./components/app/app.js";
import { program } from "commander";
import { loadData } from "./core/load-data.js";
import { RequestLine } from "./components/request-line/request-line.js";

program
  .option("-c, --config <path>")
  .name("api-tester")
  .description("Shell based Postman replacement")
  .version("0.0.1");

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