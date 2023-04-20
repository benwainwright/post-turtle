#!/usr/bin/env node

import { render } from "ink";
import { App } from "./components/app/app.js";
import { program } from "commander";

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

program.parse();
