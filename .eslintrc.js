// const path = require("path");

module.exports = {
  extends: [
    "next",
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:import/recommended",
    "prettier"
  ],
  plugins: ["prettier", "testing-library"],
  overrides: [
    // Only use Testing Library lint rules in test files
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"]
    }
  ],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["node_modules", __dirname]
      }
    }
  },
  rules: {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
};
