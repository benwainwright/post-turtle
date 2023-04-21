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
    "plugin:sonarjs/recommended",
    "problems",
  ],
  rules: {
    "no-unused-vars": "off",
    "prettier/prettier": "error",
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
    "prettier",
    "sonarjs",
  ],
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  overrides: [
    {
      files: ["**/*.spec.ts", "**/*.spec.tsx"],
      extends: ["plugin:jest/recommended"],
      rules: {
        "jest/no-conditional-expect": "off",
      },
      env: {
        jest: true,
      },
    },
  ],
};
