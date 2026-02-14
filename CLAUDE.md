# Kerjaan Automation — Code Conventions

## 1. Project Overview

Playwright test automation for **kerjaan-cp** (FE) and **hcmsvc** (BE).

- Language: TypeScript in strict mode
- Test runner: Playwright Test
- Structure: modular page-object / API-client pattern with fixture chaining

## 2. File Naming

All filenames use **kebab-case** and are named after their module/sub-module.

| Suffix         | Type                                    | Used in |
| -------------- | --------------------------------------- | ------- |
| `*.page.ts`    | Page Object Model class                 | FE      |
| `*.api.ts`     | API client class                        | BE      |
| `*.fixture.ts` | Playwright fixture extending parent     | Both    |
| `*.spec.ts`    | Test scenarios                          | Both    |
| `*.data.ts`    | Factory functions for dynamic test data | Both    |
| `*.data.json`  | Static test data                        | Both    |
| `index.ts`     | Barrel export (re-exports public API)   | Both    |

## 3. Directory Structure

```
src/           → shared source (config, core, types, helpers, constants)
tests/fe/      → frontend E2E tests
tests/be/      → backend API tests
```

- **Modules** = folders under `tests/fe/` or `tests/be/` (e.g., `auth/`, `employee/`)
- **Sub-modules** = parenthesized folders inside a module (e.g., `(login)/`, `(forgot-password)/`)

Each module/sub-module contains its own page/api, fixture, data, and spec files.

## 4. Barrel Exports

Every folder has an `index.ts` that re-exports its public API.

```typescript
// src/core/index.ts → re-exports BasePage, BaseAPI, base fixture
// src/helpers/index.ts → re-exports all helper functions
// tests/fe/auth/index.ts → re-exports auth.page, auth.fixture, auth.data
// tests/fe/auth/(login)/index.ts → re-exports login.page dependencies
```

Import via barrel:

```typescript
import { BasePage } from '@/src/core';
import { LoginPage } from '@/tests/fe/auth/(login)';
```

Sibling files in the same directory may use relative imports:

```typescript
import { LoginPage } from './login.page';
```

## 5. Import Ordering

Imports are sorted into 5 groups, enforced by ESLint (`eslint-plugin-simple-import-sort`):

1. Node.js built-ins (`node:fs`, `node:path`)
2. External packages (`@playwright/test`, `@faker-js/faker`, `dotenv`)
3. Absolute imports via `@/` alias (`@/src/core`, `@/tests/fe/auth`)
4. Relative imports (`./login.page`, `../auth.fixture`)
5. Side effect imports

## 6. Import Rules

- Use `@/` absolute paths for **cross-directory** imports (anything outside the current folder)
- Use **relative imports** only for sibling files in the **same directory**
- Never skip a barrel — when importing from another module, import from its `index.ts`
- The `@/*` path alias maps to the project root (covers `@/src/...` and `@/tests/...`)

## 7. Class Inheritance

**FE (Page Objects):**

```
BasePage → ModulePage → SubPage
```

Example: `BasePage` → `AuthPage` → `LoginPage`

**BE (API Clients):**

```
BaseAPI → ModuleAPI → SubAPI
```

Example: `BaseAPI` → `AuthAPI` → `LoginAPI`

## 8. Fixture Chain

Always import `{ test, expect }` from the **nearest parent fixture**, never from `@playwright/test` directly.

```
@playwright/test
  → src/core/base.fixture.ts       (adds: envConfig)
    → tests/fe/fe.fixture.ts       (adds: authenticatedPage)
      → tests/fe/auth/auth.fixture.ts  (adds: authPage)
    → tests/be/be.fixture.ts       (adds: apiContext, authenticatedApiContext)
      → tests/be/auth/auth.fixture.ts  (adds: authAPI)
```

Each spec file imports from its nearest parent fixture. The chain propagates all parent fixtures down.

## 9. TypeScript

- Strict mode enabled
- Path alias: `@/*` → `./*` (project root)
- `include`: `src/**/*`, `tests/**/*`, `playwright.config.ts`

## 10. Environment

- Env files: `.env.dev`, `.env.staging`, `.env.production`
- Loaded via `TEST_ENV` env var (defaults to `dev`)
- `src/config/env.config.ts` reads `TEST_ENV` and returns typed `EnvConfig`
- Never hardcode URLs or credentials — always use env vars

## 11. Test Data

- `*.data.ts` — factory functions using `@faker-js/faker` for dynamic data
- `*.data.json` — static/known-good test data (credentials, expected field values)
- Data files are scoped to their module/sub-module

## 12. Authentication & State

- **Token Caching**: `src/helpers/auth.helper.ts` caches the auth token in `.auth/token.json` to reuse across tests.
- **Storage State**: `src/helpers/auth.helper.ts` generates Playwright `storageState` in `.auth/state.json`.
- **Fixtures**:
    - `authenticatedPage` (in `fe.fixture.ts`) automatically uses the cached `storageState`.
    - `loginPage` (in `auth.fixture.ts`) uses a clean `page` context (no auth) to test the login flow itself.

## 13. Adding New Modules — Checklist

1. Create module folder (e.g., `tests/fe/employee/`)
2. Create page object (`employee.page.ts`) or API client (`employee.api.ts`)
3. Create module fixture (`employee.fixture.ts`) extending parent fixture
4. Create data files (`employee.data.ts`, `employee.data.json`)
5. Create `index.ts` barrel export
6. For sub-modules, create `(sub)/` folder and repeat the pattern
7. Sub-module page/api extends the parent module's class

## 14. IPBI Mode — Plan-First Development Workflow

When adding new features or implementing significant changes, follow the **IPBI (Input-to-Plan-Build-Iterate)** workflow:

### Workflow Phases

1. **Plan**: Create detailed implementation plan in `.github/ai-docs/plan.md`
2. **Review**: Get approval before proceeding to implementation
3. **Build**: Execute the approved plan
4. **Iterate**: Update plan and re-approve if deviations needed

### Plan Format

- **Bulleted list format with code snippets**:
    - Top-level bullets = file paths or environments (e.g., `Terminal`, `tests/fe/auth/auth.page.ts`)
    - Sub-bullets = step descriptions (what will be added/changed)
    - Code blocks = concrete implementation for each step
- **Complete coverage** — include all affected files
- **Clear context** — explain the why, not just the what

### Example Plan Structure

````markdown
# Feature: Add Submission Form Tests

> Context: Implement E2E tests for form submission flow
> Requirements: Test form validation, submission, and redirect

### `tests/fe/submission/submission.page.ts`

- Add form field locators (name, email, description inputs)
- Add submit button locator
- Add validation error message locators
- Add submitForm method to fill and submit form
- Add verifyValidationError method to check error display
- Add verifySuccessRedirect method to confirm redirect after submission

    ```typescript
    export class SubmissionPage extends BasePage {
    	readonly nameInput: Locator;
    	readonly emailInput: Locator;
    	readonly submitButton: Locator;

    	constructor(page: Page) {
    		super(page);
    		this.nameInput = page.getByLabel('Name');
    		this.emailInput = page.getByLabel('Email');
    		this.submitButton = page.getByRole('button', { name: 'Submit' });
    	}

    	async submitForm(name: string, email: string) {
    		await this.nameInput.fill(name);
    		await this.emailInput.fill(email);
    		await this.submitButton.click();
    	}
    }
    ```

### `Terminal`

- Run npm install to ensure dependencies are up to date
- Run tests in headed mode to verify implementation

    ```bash
    npm install
    npx playwright test --headed --project=fe
    ```
````

### Benefits

- **Reviewability**: Changes reviewed before implementation
- **Clarity**: Clear roadmap reduces back-and-forth
- **Documentation**: Plan serves as implementation record

### Detailed Instructions

See `.github/instructions/ipbi.instruction.md` for complete format guidelines and examples.

## Commands

| Script          | Command                                          | Purpose                                        |
| --------------- | ------------------------------------------------ | ---------------------------------------------- |
| `test`          | `npx playwright test`                            | Run all tests (FE + BE)                        |
| `test:fe`       | `npx playwright test --project=fe`               | FE tests only                                  |
| `test:be`       | `npx playwright test --project=be`               | BE tests only                                  |
| `test:fe:debug` | `npx playwright test --project=fe --debug`       | FE with Playwright Inspector                   |
| `test:be:debug` | `npx playwright test --project=be --debug`       | BE with Playwright Inspector                   |
| `test:dev`      | `cross-env TEST_ENV=dev npx playwright test`     | All tests against dev                          |
| `test:staging`  | `cross-env TEST_ENV=staging npx playwright test` | All tests against staging                      |
| `lint`          | `eslint .`                                       | Check all files for lint errors                |
| `lint:fix`      | `eslint . --fix`                                 | Auto-fix lint errors (includes import sorting) |
| `report`        | `npx playwright show-report`                     | Open HTML report                               |
| `codegen`       | `npx playwright codegen`                         | Launch code generator                          |
