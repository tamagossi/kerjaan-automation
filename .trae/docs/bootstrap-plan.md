# Kerjaan Automation — Bootstrap Plan

> Playwright test automation project for **kerjaan-cp** (FE) and **hcmsvc** (BE).
> This document is the single source of truth for project structure, conventions, and patterns.
> When bootstrapping, specify: **FE only**, **BE only**, or **Both**.

---

## 1. Tech Stack & Dependencies

| Package                    | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `@playwright/test` ^1.58.0 | Test runner, browser automation, API testing       |
| `typescript` ^5.x          | Language                                           |
| `@types/node` ^20.x        | Node type definitions                              |
| `dotenv` ^16.x             | Environment variable loading                       |
| `cross-env` ^7.x           | Cross-platform env variable setting in npm scripts |
| `@faker-js/faker` ^9.x     | Dynamic test data generation                       |
| `eslint` ^9.x                         | JavaScript/TypeScript linter (flat config)         |
| `eslint-plugin-simple-import-sort` ^12.x | Autofixable import sorting                       |
| `typescript-eslint` ^8.x               | TypeScript parser & rules for ESLint              |

All are **devDependencies**. No runtime dependencies needed.

---

## 2. Directory Tree (Full — Both FE + BE)

```
kerjaan-automation/
├── .github/
│   └── copilot-instructions.md           # AI code conventions (Copilot)
├── .trae/
│   ├── docs/
│   │   └── bootstrap-plan.md          # This file
│   └── rules/
│       └── code-conventions.md           # AI code conventions (Trae)
├── CLAUDE.md                             # AI code conventions (Claude Code)
├── eslint.config.mjs                     # ESLint flat config (import sorting)
├── .env.example                       # Template with all required env vars
├── .env.dev                           # Dev environment values
├── .env.staging                       # Staging environment values
├── .env.production                    # Production environment values
├── .gitignore
├── package.json
├── tsconfig.json
├── playwright.config.ts               # Single config with 'fe' and 'be' projects
│
├── src/                               # Shared source code (not tests)
│   ├── config/
│   │   ├── env.config.ts              # Loads correct .env file based on TEST_ENV
│   │   └── index.ts                   # Barrel export
│   ├── core/
│   │   ├── base.fixture.ts            # Root fixture: extends @playwright/test, adds envConfig
│   │   ├── base.page.ts               # [FE] Abstract base class for all page objects
│   │   ├── base.api.ts                # [BE] Abstract base class for all API clients
│   │   └── index.ts                   # Barrel export
│   ├── types/
│   │   ├── env.types.ts               # EnvConfig interface
│   │   ├── api.types.ts               # [BE] Shared API response types
│   │   └── index.ts                   # Barrel export
│   ├── helpers/
│   │   ├── auth.helper.ts             # Get auth tokens via API (used by both FE and BE)
│   │   ├── data.helper.ts             # Cross-cutting data utilities (generateEmail, etc.)
│   │   ├── assertion.helper.ts        # [BE] API response assertion utilities
│   │   └── index.ts                   # Barrel export
│   └── constants/
│       ├── routes.ts                  # [FE] Frontend route paths (/login, /dashboard, etc.)
│       ├── endpoints.ts               # [BE] API endpoint paths (/auth/login, etc.)
│       └── index.ts                   # Barrel export
│
└── tests/
    ├── fe/                            # Frontend E2E tests
    │   ├── fe.fixture.ts              # FE-wide fixture: adds authenticatedPage
    │   ├── index.ts                   # Barrel export
    │   └── auth/                      # Module: auth
    │       ├── auth.page.ts           # Page object for auth-related shared elements
    │       ├── auth.fixture.ts        # Module fixture: adds authPage
    │       ├── auth.data.ts           # Auth-level data factories
    │       ├── auth.data.json         # Auth-level static test data
    │       ├── index.ts               # Barrel export
    │       ├── (login)/               # Sub-module: login
    │       │   ├── login.page.ts      # LoginPage extends AuthPage
    │       │   ├── login.spec.ts      # Login test scenarios
    │       │   ├── login.data.ts      # Login data factories
    │       │   ├── login.data.json    # Login static test data
    │       │   └── index.ts           # Barrel export
    │       └── (forgot-password)/     # Sub-module: forgot-password
    │           ├── forgot-password.page.ts
    │           ├── forgot-password.spec.ts
    │           ├── forgot-password.data.ts
    │           ├── forgot-password.data.json
    │           └── index.ts           # Barrel export
    │
    └── be/                            # Backend API tests
        ├── be.fixture.ts              # BE-wide fixture: adds apiContext, authenticatedApiContext
        ├── index.ts                   # Barrel export
        └── auth/                      # Module: auth
            ├── auth.api.ts            # API client for auth endpoints
            ├── auth.fixture.ts        # Module fixture: adds authAPI
            ├── auth.data.ts           # Auth-level data factories
            ├── auth.data.json         # Auth-level static test data
            ├── index.ts               # Barrel export
            ├── (login)/               # Sub-module: login
            │   ├── login.api.ts       # LoginAPI extends AuthAPI
            │   ├── login.spec.ts      # Login API test scenarios
            │   ├── login.data.ts      # Login data factories
            │   ├── login.data.json    # Login static test data
            │   └── index.ts           # Barrel export
            └── (register)/            # Sub-module: register
                ├── register.api.ts
                ├── register.spec.ts
                ├── register.data.ts
                ├── register.data.json
                └── index.ts           # Barrel export
```

---

## 3. Config Files

### `playwright.config.ts`

Single config file defining two Playwright **projects**:

- **`fe` project**: `testDir: './tests/fe'`, `headless: false`, `slowMo: 300`, uses Chromium, `baseURL` from `FE_BASE_URL` env var
- **`be` project**: `testDir: './tests/be'`, no browser needed (API-only), `baseURL` from `BE_BASE_URL` env var

Shared settings across both projects:

- `retries: 0` (no retries for local dev; override in CI)
- `reporter: [['html', { open: 'never' }]]`
- `trace: 'on-first-retry'`
- `globalSetup` loads the `.env` file via `src/config/env.config.ts`

Run FE tests: `npx playwright test --project=fe`
Run BE tests: `npx playwright test --project=be`
Run both: `npx playwright test`

### `tsconfig.json`

- `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`
- `strict: true`
- `paths`: `@/*` → `./*` for clean imports (covers both src/ and tests/)
- `include`: `src/**/*`, `tests/**/*`, `playwright.config.ts`

### `package.json`

- All deps as `devDependencies`
- Scripts defined in section 9 below

---

## 4. Environment Management

### `.env` file pattern

Files: `.env.dev`, `.env.staging`, `.env.production`, `.env.example`

Switching: `TEST_ENV=staging npx playwright test` → loads `.env.staging`

### Required variables

```env
# App URLs
FE_BASE_URL=http://localhost:3000
BE_BASE_URL=http://localhost:8080
BE_API_VERSION=v1

# Auth credentials (for test login)
ADMIN_EMAIL=admin@staffinc.co
ADMIN_PASSWORD=secret

# Test settings
SLOW_MO=300
HEADLESS=false
```

### How it loads

`src/config/env.config.ts` reads `process.env.TEST_ENV` (defaults to `dev`), calls `dotenv.config({ path: '.env.${TEST_ENV}' })`, and returns a typed `EnvConfig` object. This is consumed by `playwright.config.ts` and by the `envConfig` fixture.

---

## 5. Base Classes

### `BasePage` (`src/core/base.page.ts`) — FE only

Abstract class that all page objects inherit from. Receives `Page` in constructor.

Provides common methods:

- `navigate(path)` — goes to `baseURL + path`
- `waitForPageLoad()` — waits for `networkidle`
- `fillInput(locator, value)` — clears and types into input
- `expectUrl(pattern)` — asserts current URL matches
- `expectVisible(locator)` — asserts element is visible
- `expectText(locator, text)` — asserts element text content
- `takeScreenshot(name)` — saves screenshot for debugging

### `BaseAPI` (`src/core/base.api.ts`) — BE only

Abstract class that all API clients inherit from. Receives `APIRequestContext` in constructor.

Provides typed HTTP methods:

- `get(endpoint, options?)` → `APIResponse`
- `post(endpoint, data?, options?)` → `APIResponse`
- `put(endpoint, data?, options?)` → `APIResponse`
- `patch(endpoint, data?, options?)` → `APIResponse`
- `delete(endpoint, options?)` → `APIResponse`
- `parseJson<T>(response)` → `T` — typed JSON parsing helper

All methods automatically prefix the `BE_API_VERSION` to endpoints.

### `base.fixture.ts` (`src/core/base.fixture.ts`) — Shared

Extends `@playwright/test` with a single shared fixture:

- `envConfig` — typed `EnvConfig` object available to all tests

This is the root of the fixture chain. Both `fe.fixture.ts` and `be.fixture.ts` extend from this.

---

## 6. Module-Scoped Folder Convention

### Structure per module

Each **module** (e.g., `auth`, `employee`, `payroll`) is a folder under `tests/fe/` or `tests/be/` containing:

| File                                    | Purpose                                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `{module}.page.ts` or `{module}.api.ts` | Page object (FE) or API client (BE) for the module                                        |
| `{module}.fixture.ts`                   | Module-level fixture extending the parent fixture, injects the page/API as a test fixture |
| `{module}.data.ts`                      | Factory functions for dynamic test data                                                   |
| `{module}.data.json`                    | Static/known-good test data                                                               |
| `{module}.spec.ts`                      | Test specs (optional at module level; usually specs live in sub-modules)                  |

### Sub-modules use parentheses

Sub-modules are folders wrapped in parentheses: `(login)/`, `(forgot-password)/`, `(create)/`

Each sub-module contains the same file pattern:

- `{sub}.page.ts` / `{sub}.api.ts` — extends the parent module's page/API class
- `{sub}.spec.ts` — test scenarios for this sub-feature
- `{sub}.data.ts` + `{sub}.data.json` — sub-module-specific test data

The parentheses are a **naming convention only** (inspired by Next.js route groups). Playwright's `**/*.spec.ts` glob picks them up automatically — no config changes needed.

### Barrel exports

Every folder has an `index.ts` that re-exports its public API:

- `src/core/index.ts` → re-exports BasePage, BaseAPI, base fixture
- `src/helpers/index.ts` → re-exports all helper functions
- `tests/fe/auth/index.ts` → re-exports auth.page, auth.fixture, auth.data
- `tests/fe/auth/(login)/index.ts` → re-exports login.page, login.spec dependencies

Import via barrel:

```typescript
import { BasePage } from "@/src/core";
import { LoginPage } from "@/tests/fe/auth/(login)";
```

Sibling files in the same directory may use relative imports:

```typescript
import { LoginPage } from "./login.page";
```

### Example hierarchy

```
tests/fe/auth/                    # Module: auth
  auth.page.ts                    # AuthPage extends BasePage
  auth.fixture.ts                 # Adds authPage fixture
  (login)/                        # Sub-module: login
    login.page.ts                 # LoginPage extends AuthPage
    login.spec.ts                 # Imports from auth.fixture.ts
  (forgot-password)/              # Sub-module: forgot-password
    forgot-password.page.ts       # ForgotPasswordPage extends AuthPage
    forgot-password.spec.ts       # Imports from auth.fixture.ts
```

---

## 7. File Naming Convention

| Suffix         | Type                                                  | Used in |
| -------------- | ----------------------------------------------------- | ------- |
| `*.page.ts`    | Page Object Model class                               | FE only |
| `*.api.ts`     | API client class                                      | BE only |
| `*.fixture.ts` | Playwright fixture extending parent                   | Both    |
| `*.spec.ts`    | Test scenarios                                        | Both    |
| `*.data.ts`    | Factory functions for dynamic test data               | Both    |
| `*.data.json`  | Static test data (known credentials, expected fields) | Both    |
| `index.ts`     | Barrel export re-exporting folder's public API        | Both    |

All files are named after their module/sub-module: `login.page.ts`, `login.spec.ts`, `login.data.ts`.

---

## 8. Fixture Inheritance Chain

```
@playwright/test                     (built-in: page, request, browser, context)
       │
       ▼
src/core/base.fixture.ts             (adds: envConfig)
       │
       ├──► tests/fe/fe.fixture.ts   (adds: authenticatedPage)
       │         │
       │         ├──► tests/fe/auth/auth.fixture.ts    (adds: authPage)
       │         │         │
       │         │         ├──► (login)/login.spec.ts
       │         │         └──► (forgot-password)/forgot-password.spec.ts
       │         │
       │         └──► tests/fe/employee/employee.fixture.ts   (adds: employeePage)
       │                   │
       │                   └──► (create)/create-employee.spec.ts
       │
       └──► tests/be/be.fixture.ts   (adds: apiContext, authenticatedApiContext)
                 │
                 ├──► tests/be/auth/auth.fixture.ts    (adds: authAPI)
                 │         │
                 │         ├──► (login)/login.spec.ts
                 │         └──► (register)/register.spec.ts
                 │
                 └──► tests/be/employee/employee.fixture.ts   (adds: employeeAPI)
```

**Rule**: Each spec file imports `{ test, expect }` from its **nearest parent fixture**. The fixture chain propagates all parent fixtures down, so `login.spec.ts` has access to `envConfig`, `page`, `authPage`, etc.

---

## 9. npm Scripts

### Core commands

| Script          | Command                                    | Purpose                      |
| --------------- | ------------------------------------------ | ---------------------------- |
| `test`          | `npx playwright test`                      | Run all tests (FE + BE)      |
| `test:fe`       | `npx playwright test --project=fe`         | FE tests only                |
| `test:be`       | `npx playwright test --project=be`         | BE tests only                |
| `test:fe:debug` | `npx playwright test --project=fe --debug` | FE with Playwright Inspector |
| `test:be:debug` | `npx playwright test --project=be --debug` | BE with Playwright Inspector |

### Per-environment commands

| Script            | Command                                                       | Purpose                      |
| ----------------- | ------------------------------------------------------------- | ---------------------------- |
| `test:dev`        | `cross-env TEST_ENV=dev npx playwright test`                  | All tests against dev        |
| `test:staging`    | `cross-env TEST_ENV=staging npx playwright test`              | All tests against staging    |
| `test:production` | `cross-env TEST_ENV=production npx playwright test`           | All tests against production |
| `test:fe:dev`     | `cross-env TEST_ENV=dev npx playwright test --project=fe`     | FE against dev               |
| `test:fe:staging` | `cross-env TEST_ENV=staging npx playwright test --project=fe` | FE against staging           |
| `test:be:dev`     | `cross-env TEST_ENV=dev npx playwright test --project=be`     | BE against dev               |
| `test:be:staging` | `cross-env TEST_ENV=staging npx playwright test --project=be` | BE against staging           |

### Lint commands

| Script     | Command          | Purpose                                        |
| ---------- | ---------------- | ---------------------------------------------- |
| `lint`     | `eslint .`       | Check all files for lint errors                |
| `lint:fix` | `eslint . --fix` | Auto-fix lint errors (includes import sorting) |

### Utility commands

| Script    | Command                      | Purpose               |
| --------- | ---------------------------- | --------------------- |
| `report`  | `npx playwright show-report` | Open HTML report      |
| `codegen` | `npx playwright codegen`     | Launch code generator |

### Targeted test commands

| Script         | Command                                    | Purpose                                  |
| -------------- | ------------------------------------------ | ---------------------------------------- |
| `test:grep`    | `npx playwright test --grep`               | Run tests matching a pattern (FE + BE)   |
| `test:fe:grep` | `npx playwright test --project=fe --grep`  | Run FE tests matching a pattern          |
| `test:be:grep` | `npx playwright test --project=be --grep`  | Run BE tests matching a pattern          |

These use npm's `--` arg pass-through to forward the grep pattern to Playwright.

**Why `--grep` over file paths**: `--grep` matches against `test.describe()` and `test()` names, so it works at both feature level and individual test case level — no need to escape parentheses in file paths. More intuitive: `npm run test:fe:grep -- "Login"` vs `npx playwright test tests/fe/auth/\(login\)/login.spec.ts`.

#### Usage examples

```bash
# Run a specific feature (matches describe block name)
npm run test:fe:grep -- "Login"

# Run a specific test case (matches test name)
npm run test:fe:grep -- "should login successfully with valid credentials"

# Run all auth-related tests across FE and BE
npm run test:grep -- "auth"

# Run a specific API test suite
npm run test:be:grep -- "POST /auth/login"

# Combine with environment
cross-env TEST_ENV=staging npm run test:fe:grep -- "Login"
```

---

## 10. Bootstrap Strategy

When asked to bootstrap, create only the relevant subset:

### FE Only

Creates:

- Root configs: `.env.example`, `.env.dev`, `.gitignore`, `package.json`, `tsconfig.json`
- `playwright.config.ts` — with **only** the `fe` project defined
- `src/config/env.config.ts`, `src/types/env.types.ts`
- `src/core/base.fixture.ts`, `src/core/base.page.ts`
- `src/helpers/auth.helper.ts`, `src/helpers/data.helper.ts`
- `src/constants/routes.ts`
- `tests/fe/fe.fixture.ts`
- Example module: `tests/fe/auth/` with `(login)/` sub-module

**Does NOT create**: `base.api.ts`, `api.types.ts`, `endpoints.ts`, `assertion.helper.ts`, `tests/be/`

### BE Only

Creates:

- Root configs: `.env.example`, `.env.dev`, `.gitignore`, `package.json`, `tsconfig.json`
- `playwright.config.ts` — with **only** the `be` project defined
- `src/config/env.config.ts`, `src/types/env.types.ts`, `src/types/api.types.ts`
- `src/core/base.fixture.ts`, `src/core/base.api.ts`
- `src/helpers/auth.helper.ts`, `src/helpers/data.helper.ts`, `src/helpers/assertion.helper.ts`
- `src/constants/endpoints.ts`
- `tests/be/be.fixture.ts`
- Example module: `tests/be/auth/` with `(login)/` sub-module

**Does NOT create**: `base.page.ts`, `routes.ts`, `tests/fe/`

### Both FE + BE

Creates the **full directory tree** from section 2. `playwright.config.ts` includes both `fe` and `be` projects. All shared utilities created.

### Post-bootstrap steps

```bash
npm install
npx playwright install          # Only needed if FE tests are included (installs browsers)
```

---

## 11. Adding New Modules — Developer Checklist

### Adding an FE module (e.g., `employee`)

1. Create `tests/fe/employee/`
2. Create `employee.page.ts` — class extending `BasePage`
3. Create `employee.fixture.ts` — extends `fe.fixture`, provides `employeePage` as a fixture
4. Create `employee.data.ts` and/or `employee.data.json`
5. For sub-modules (e.g., create employee), create `(create)/` with:
    - `create-employee.page.ts` extending `EmployeePage`
    - `create-employee.spec.ts` importing from `employee.fixture.ts`
    - `create-employee.data.ts` / `create-employee.data.json`

### Adding a BE module (e.g., `employee`)

1. Create `tests/be/employee/`
2. Create `employee.api.ts` — class extending `BaseAPI`
3. Create `employee.fixture.ts` — extends `be.fixture`, provides `employeeAPI` as a fixture
4. Create `employee.data.ts` and/or `employee.data.json`
5. For sub-modules, create `(sub)/` with the same pattern

**No config changes needed** — Playwright's glob patterns (`**/*.spec.ts`) automatically detect new spec files.
