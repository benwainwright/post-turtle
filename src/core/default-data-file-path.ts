import { join } from "node:path";
import { homedir } from "node:os";

const DEFAULT_FILENAME = ".post-turtle-requests";

export const defaultDatafile = () => join(homedir(), DEFAULT_FILENAME);
