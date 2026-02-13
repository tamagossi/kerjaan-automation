import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Node.js built-ins
            ["^node:"],
            // 2. External packages (@playwright/test, @faker-js/faker, dotenv)
            ["^@?\\w"],
            // 3. Absolute imports via @/ alias
            ["^@/"],
            // 4. Relative imports (sibling files)
            ["^\\."],
            // 5. Side effect imports
            ["^\\u0000"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  {
    ignores: ["node_modules/", "playwright-report/", "test-results/"],
  },
];
