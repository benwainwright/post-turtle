module.exports = {
  ignorePatterns: ["dist", "node_modules"],
  settings: {
    react: {
      version: "18.2.0",
    },

    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },

    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:array-func/recommended",
    "plugin:promise/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "filenames/match-regex": ["error", "^\\.?[a-z-\\.]+$", true],
    "import/no-default-export": "error",
  },
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "jest",
    "array-func",
    "@typescript-eslint",
    "promise",
    "filenames",
    "import",
    "only-error",
  ],
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  overrides: [
    {
      files: ["**/*.spect.ts", "**/*.spect.tsx"],
      extends: ["plugin:jest/recommended"],
      env: {
        jest: true,
      },
    },
  ],
};
