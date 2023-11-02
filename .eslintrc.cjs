/* eslint-env node */
// require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting"
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  env: {
    node: true,
    browser: true
  },
  rules: {
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true
      }
    ],
    semi: [
      "error",
      "always",
      {
        omitLastInOneLineBlock: true
      }
    ],
    "no-trailing-spaces": "error",
    "vue/max-len": [
      "error",
      {
        code: 120,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
        ignoreHTMLTextContents: true,
        ignoreHTMLAttributeValues: true
      }
    ],
    "comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        objects: "only-multiline",
        functions: "never",
        imports: "only-multiline",
        exports: "never"
      }
    ],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "eol-last": ["warn", "always"],
    "no-constant-condition": ["error", { checkLoops: false }],
    "sort-imports": [
      "warn",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
        allowSeparatedGroups: true
      }
    ]
  },
  overrides: [
    {
      files: ["pages/**/*.vue", "layouts/**/*.vue"],
      rules: {
        "vue/multi-word-component-names": "off"
      }
    }
  ]
};
