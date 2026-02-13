# Kerjaan Automation — Code Conventions

## 1. Project Overview

- Playwright test automation for **kerjaan-cp** (FE) and **hcmsvc** (BE)
- TypeScript strict mode, Playwright Test runner
- Modular page-object / API-client pattern with fixture chaining

## 2. File Naming

- All filenames: **kebab-case**, named after module/sub-module
- `*.page.ts` — Page Object Model (FE)
- `*.api.ts` — API client class (BE)
- `*.fixture.ts` — Playwright fixture extending parent
- `*.spec.ts` — test scenarios
- `*.data.ts` — dynamic test data factories (faker)
- `*.data.json` — static test data
- `index.ts` — barrel export re-exporting folder's public API

## 3. Directory Structure

- `src/` — shared source (config, core, types, helpers, constants)
- `tests/fe/` — frontend E2E tests
- `tests/be/` — backend API tests
- **Modules** = folders under `tests/fe/` or `tests/be/` (e.g., `auth/`)
- **Sub-modules** = parenthesized folders (e.g., `(login)/`, `(forgot-password)/`)

## 4. Barrel Exports

- Every folder has an `index.ts` that re-exports its public API
- Import from barrels: `import { BasePage } from "@/src/core"`
- Import sub-modules: `import { LoginPage } from "@/tests/fe/auth/(login)"`
- Sibling relative imports allowed: `import { LoginPage } from "./login.page"`

## 5. Import Ordering

5 groups enforced by ESLint (`eslint-plugin-simple-import-sort`):

1. Node.js built-ins (`node:fs`, `node:path`)
2. External packages (`@playwright/test`, `@faker-js/faker`, `dotenv`)
3. Absolute imports via `@/` alias (`@/src/core`, `@/tests/fe/auth`)
4. Relative imports (`./login.page`, `../auth.fixture`)
5. Side effect imports

## 6. Import Rules

- `@/` absolute paths for cross-directory imports
- Relative imports only for siblings in the same directory
- Never skip a barrel — import from `index.ts` when crossing module boundaries
- `@/*` maps to project root (covers `@/src/...` and `@/tests/...`)

## 7. Class Inheritance

- **FE:** `BasePage` → `ModulePage` → `SubPage` (e.g., `BasePage` → `AuthPage` → `LoginPage`)
- **BE:** `BaseAPI` → `ModuleAPI` → `SubAPI` (e.g., `BaseAPI` → `AuthAPI` → `LoginAPI`)

## 8. Fixture Chain

- Always import `{ test, expect }` from **nearest parent fixture**, never from `@playwright/test`
- Chain: `@playwright/test` → `base.fixture` → `fe.fixture`/`be.fixture` → module fixture → spec
- Each layer adds its own fixtures; all parent fixtures propagate down

## 9. TypeScript

- Strict mode enabled
- Path alias: `@/*` → `./*` (project root)
- Include: `src/**/*`, `tests/**/*`, `playwright.config.ts`

## 10. Environment

- `.env.dev`, `.env.staging`, `.env.production`
- Switched via `TEST_ENV` env var (defaults to `dev`)
- Loaded by `src/config/env.config.ts` → typed `EnvConfig`
- Never hardcode URLs or credentials

## 11. Test Data

- `*.data.ts` — factory functions with `@faker-js/faker` for dynamic data
- `*.data.json` — static/known-good test data
- Scoped to module/sub-module

## 12. Adding New Modules

1. Create module folder (e.g., `tests/fe/employee/`)
2. Create page object or API client extending base class
3. Create module fixture extending parent fixture
4. Create data files (`*.data.ts`, `*.data.json`)
5. Create `index.ts` barrel export
6. For sub-modules: create `(sub)/` folder, repeat pattern
7. Sub-module page/api extends parent module's class
