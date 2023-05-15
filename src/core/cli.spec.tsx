import { promisify } from "node:util";
import { exec as execRaw } from "child_process";
import { mkdtemp, rmdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
const exec = promisify(execRaw);

let path: string | undefined;

beforeEach(async () => {
  path = await mkdtemp(join(tmpdir(), "cli-test"));
});

afterEach(async () => {
  if (path) {
    await rmdir(path, { recursive: true });
  }
});

describe("The cli", () => {
  it("Running <command> call gives you a list of available commands", async () => {});
});
