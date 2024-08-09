#!/usr/bin/env node --enable-source-maps

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const runFile = join(currentDirectory, "..", "dist", "core", "build-cli.js");
const { buildCli } = await import(runFile);

const program = await buildCli();

program.parse();
