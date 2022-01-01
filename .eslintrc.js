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
    "prefer-arrow-callback": "off",
    // See: https://www.sanity.io/docs/parts#e778915da57f
    "import/no-unresolved": [2, { ignore: ["^(all|part):"] }]
  }
};
