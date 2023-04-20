#!/usr/bin/env node

import { render } from "ink";
import { App } from "./components/app/app.js";
import { program } from "commander";
import { loadData } from "./core/load-data.js";
import { RequestLine } from "./components/request-line/request-line.js";

const data = await loadData();

program
  .option("-c, --config <path>")
  .name("api-tester")
  .description("Shell based Postman replacement")
  .version("0.0.1");

program
  .command("run")
  .description("Run interactive mode")
  .action(() => {
    render(<App />);
  });

const call = program.command("call").description("Call saved HTTP request");

data.forEach((request) =>
  call
    .command(request.slug)
    .description(request.title)
    .action(() => {
      render(<RequestLine request={request} immediateTrigger />);
    })
);

program.parse();
