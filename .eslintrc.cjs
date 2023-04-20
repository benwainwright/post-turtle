module.exports = {
  ignorePatterns: ["dist", "node_modules"],
  settings: {
    react: {
      version: "18.2.0",
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  overrides: [
    {
      files: ["**/*.spect.ts", "**/*.spect.tsx"],
      env: {
        jest: true,
      },
    },
  ],
};
