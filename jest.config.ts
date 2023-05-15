import type { Config } from "jest";

const mainConfig: Config = {
  modulePathIgnorePatterns: [`<rootDir>/dist/`],
  moduleNameMapper: {
    "(.+)\\.js": "$1",
    "(.+)\\.jsx": "$1",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  coveragePathIgnorePatterns: [
    ".*\\.spec\\.ts",
    ".*\\.spec\\.tsx",
    "<rootDir>/src/setup-jest.ts",
    "<rootDir>/src/run.ts",
  ],
};

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*"],
  coverageThreshold: {
    global: {
      statements: 84,
      branches: 75,
      functions: 78,
      lines: 84,
    },
  },
  projects: [
    {
      ...mainConfig,
      displayName: "app",
      testMatch: [
        "<rootDir>/src/components/**/*.spec.tsx",
        "<rootDir>/src/core/**/*.spec.tsx",
        "<rootDir>/src/types/**/*.spec.tsx",
        "<rootDir>/src/components/**/*.spec.ts",
        "<rootDir>/src/core/**/*.spec.ts",
        "<rootDir>/src/types/**/*.spec.ts",
      ],
    },
    {
      testEnvironment: "jsdom",
      displayName: "hooks",
      setupFiles: [`<rootDir>/src/setup-jest.ts`],
      testMatch: ["<rootDir>/src/hooks/**/*.spec.ts"],
      ...mainConfig,
    },
  ],
};

// eslint-disable-next-line import/no-default-export
export default config;
