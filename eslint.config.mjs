// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintImport from "eslint-plugin-import";
import eslintUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import { rules as stepdownRules } from "/Users/alythobani/dev/app-extensions/typescript-eslint-plugins/stepdown-rule/dist/src/index.js";

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["src/**/*ts", "eslint.config.mjs"],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      stepdown: { rules: stepdownRules },
      import: eslintImport,
      "unused-imports": eslintUnusedImports,
    },
    rules: {
      // #region eslint builtins
      eqeqeq: "error",
      "no-useless-rename": "error",
      "object-shorthand": "error",
      // #endregion
      // #region eslint plugins
      "stepdown/stepdown-rule": "error",
      // #region eslint-plugin-import
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          groups: [
            "type",
            "builtin",
            "external",
            ["internal", "parent", "sibling"],
            ["index", "object"],
            "unknown",
          ],
          named: { enabled: true, types: "types-first" },
          pathGroups: [{ pattern: "~*/**", group: "internal", position: "before" }],
          pathGroupsExcludedImportTypes: ["type"],
          "newlines-between": "always",
        },
      ],
      // #endregion
      // #region unused-imports
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-imports": "error",
      // #endregion
      // #endregion
      // #region typescript-eslint
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowBoolean: true,
          allowNumber: true,
        },
      ],
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
        },
      ],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-indexed-object-style": ["error", "index-signature"],
      "@typescript-eslint/no-restricted-types": [
        "error",
        { types: { null: { message: "Use undefined instead of null", suggest: ["undefined"] } } },
      ],
      // #endregion
    },
  },
);
