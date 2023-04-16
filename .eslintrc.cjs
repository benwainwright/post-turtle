module.exports = {
  ignorePatterns: ["dist", "node_modules"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
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
