import type { Config } from "jest";

const mainConfig: Config = {
  modulePathIgnorePatterns: [`<rootDir>/dist/`],
  moduleNameMapper: {
    "(.+)\\.js": "$1",
    "(.+)\\.jsx": "$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*"],
  projects: [
    {
      ...mainConfig,
      displayName: "app",
      testMatch: [
        "<rootDir>/src/components/**/*.spec.tsx",
        "<rootDir>/src/core/**/*.spec.tsx",
        "<rootDir>/src/types/**/*.spec.tsx",
      ],
    },
    {
      testEnvironment: "jsdom",
      displayName: "hooks",
      testMatch: ["<rootDir>/src/hooks/**/*.spec.ts"],
      ...mainConfig,
    },
  ],
};

export default config;
