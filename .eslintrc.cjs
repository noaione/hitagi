/* eslint-env node */
// require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
    "plugin:unicorn/recommended",
    "plugin:promise/recommended",
  ],
  plugins: ["vue", "@typescript-eslint", "prettier", "@stylistic/js", "@stylistic/ts", "unicorn", "promise"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    node: true,
    browser: true,
  },
  rules: {
    quotes: [
      "error",
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    semi: [
      "error",
      "always",
      {
        omitLastInOneLineBlock: true,
      },
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
        ignoreHTMLAttributeValues: true,
      },
    ],
    "comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        objects: "only-multiline",
        functions: "never",
        imports: "only-multiline",
        exports: "never",
      },
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
        allowSeparatedGroups: true,
      },
    ],
    "@stylistic/ts/indent": ["error", 2],
    "padding-line-between-statements": [
      "error",
      // Always require blank lines after directives (like 'use-strict'), except between directives
      { blankLine: "always", prev: "directive", next: "*" },
      { blankLine: "any", prev: "directive", next: "directive" },
      // Always require blank lines after import, except between imports
      { blankLine: "always", prev: "import", next: "*" },
      { blankLine: "any", prev: "import", next: "import" },
      // Always require blank lines before and after every sequence of variable declarations and export
      {
        blankLine: "always",
        prev: "*",
        next: ["const", "let", "var", "export"],
      },
      {
        blankLine: "always",
        prev: ["const", "let", "var", "export"],
        next: "*",
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var", "export"],
        next: ["const", "let", "var", "export"],
      },
      {
        blankLine: "always",
        prev: "*",
        next: ["if", "class", "for", "do", "while", "switch", "try"],
      },
      {
        blankLine: "always",
        prev: ["if", "class", "for", "do", "while", "switch", "try"],
        next: "*",
      },
      // Always require blank lines before return statements
      { blankLine: "always", prev: "*", next: "return" },
    ],
    "unicorn/prevent-abbreviations": "off",
    "unicorn/prefer-at": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
        },
      },
    ],
    "vue/define-macros-order": [
      "error",
      {
        order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
      },
    ],
    "vue/multiline-html-element-content-newline": "error",
    "vue/multi-word-component-names": "off",
    "vue/return-in-computed-property": "off",
    "vue/block-lang": [
      "error",
      {
        script: {
          lang: "ts",
        },
        style: {
          lang: "postcss",
        },
      },
    ],
    "promise/always-return": "off",
    "vue/no-v-html": "warn",
    "generator-star-spacing": [
      "error",
      {
        before: true,
        after: false,
      },
    ],
    "space-infix-ops": "error",
    "@stylistic/js/array-element-newline": ["error", "consistent"],
  },
  overrides: [
    {
      files: ["pages/**/*.vue", "layouts/**/*.vue"],
      rules: {
        "vue/multi-word-component-names": "off",
      },
    },
    {
      files: ["*.vue"],
      rules: {
        "unicorn/filename-case": "off",
      },
    },
    {
      files: ["scripts/*.js"],
      rules: {
        "unicorn/prefer-module": "off",
      },
    },
  ],
};
