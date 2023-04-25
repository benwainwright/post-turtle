#!/usr/bin/env node

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const runFile = join(currentDirectory, "..", "dist", "src", "core", "cli.js");
await import(runFile);
