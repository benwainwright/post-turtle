import { promisify } from "node:util";
import { exec as execRaw } from "child_process";
const exec = promisify(execRaw);

describe("The cli", () => {
  it("Running <command> call gives you a list of available commands", () => {
    const { stdout, stdin } = await exec("yarn start call");

    console.log(stdout);
  });
});
