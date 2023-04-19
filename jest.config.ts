import type { Config } from "jest";

const config: Config = {
  collectCoverageFrom: ["./src/**/*"],
  collectCoverage: true,
  modulePathIgnorePatterns: [`<rootDir>/dist/`],
  moduleNameMapper: {
    "(.+)\\.js": "$1",
    "(.+)\\.jsx": "$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

export default config;
