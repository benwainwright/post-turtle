import { buildCli } from "./core/build-cli.js";

const program = await buildCli();

program.parse();
