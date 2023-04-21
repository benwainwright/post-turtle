import path from "node:path";

export const defaultDatafile = () => path.join(process.cwd(), "requests.json");
