# Implement Login Automation Tests

> Context: Create automation tests for the Login page (`pages/login.tsx`) in the `auth` module.
>
> **Updates**:
>
> - **Local Execution**: Use `http://localhost:3000` for `FE_BASE_URL`.
> - **Credentials**: Store in `tests/fe/auth/(login)/login.constant.ts`.
> - **Storage State**: Implement `storageState` caching in `auth.helper.ts` and use it in `fe.fixture.ts` to share auth state across tests efficiently.
> - **Fixture Separation**: Ensure `loginPage` uses a clean `page` context (not authenticated), while `authenticatedPage` uses the stored state.

## Directory Structure

- Create directory `tests/fe/auth/(login)`
- Ensure directory `.auth` exists.

## File Operations

- `Terminal`
    - Create `.env.dev` with localhost URL and API URL.
        ```bash
        cat <<EOF > .env.dev
        FE_BASE_URL=http://localhost:3000
        BE_BASE_URL=https://api.dev.kerjaan.co.id
        BE_API_VERSION=v1
        SLOW_MO=500
        HEADLESS=false
        EOF
        ```

## File Implementation Plan

### 1. Token & State Caching (`src/helpers/auth.helper.ts`)

- `getAuthToken()`: Return cached token or fetch new one.
- `getStorageState(url: string)`: Generate Playwright storage state.

    ```typescript
    import fs from 'node:fs';
    import path from 'node:path';
    import { request } from '@playwright/test';
    import { loadEnvConfig } from '@/src/config';
    import { LOGIN_CREDENTIALS } from '@/tests/fe/auth/(login)/login.constant';

    const AUTH_DIR = path.resolve(process.cwd(), '.auth');
    const TOKEN_PATH = path.join(AUTH_DIR, 'token.json');
    const STATE_PATH = path.join(AUTH_DIR, 'state.json');

    export async function getAuthToken(): Promise<string> {
    	if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
    	if (fs.existsSync(TOKEN_PATH)) {
    		/* Check age < 24h and return cached token */
    	}

    	const env = loadEnvConfig();
    	const apiContext = await request.newContext({ baseURL: env.BE_BASE_URL });
    	const response = await apiContext.post(`/${env.BE_API_VERSION}/auth/login`, {
    		data: { email: LOGIN_CREDENTIALS.EMAIL, password: LOGIN_CREDENTIALS.PASSWORD },
    	});
    	// ... handle response, cache token ...
    }

    export async function getStorageState(url: string): Promise<string> {
    	if (fs.existsSync(STATE_PATH)) {
    		/* Check age and return path */
    	}
    	const token = await getAuthToken();
    	const urlObj = new URL(url);
    	const state = {
    		cookies: [
    			{
    				name: 'token',
    				value: token,
    				domain: urlObj.hostname,
    				path: '/',
    				expires: -1,
    				httpOnly: false,
    				secure: false,
    				sameSite: 'Lax',
    			},
    		],
    		origins: [],
    	};
    	fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
    	return STATE_PATH;
    }
    ```

### 2. Base Fixture Update (`tests/fe/fe.fixture.ts`)

- Update `authenticatedPage` fixture to use `storageState`.

    ```typescript
    import { getStorageState } from '@/src/helpers';

    export const test = base.extend<FeFixtures>({
    	authenticatedPage: async ({ browser, envConfig }, use) => {
    		const statePath = await getStorageState(envConfig.FE_BASE_URL);
    		const context = await browser.newContext({
    			baseURL: envConfig.FE_BASE_URL,
    			storageState: statePath,
    		});
    		const page = await context.newPage();
    		await use(page);
    		await context.close();
    	},
    });
    ```

### 3. Constants (`tests/fe/auth/(login)/login.constant.ts`)

- Export `LOGIN_CREDENTIALS`.

    ```typescript
    export const LOGIN_CREDENTIALS = {
    	EMAIL: 'annisa.fajri+dev@staffinc.co',
    	PASSWORD: 'Asdasd123.',
    };
    ```

### 4. Page Object Model (`tests/fe/auth/(login)/login.page.ts`)

- Class `LoginPage` extends `BasePage`.

    ```typescript
    import { type Locator, type Page, expect } from '@playwright/test';
    import { BasePage } from '@/src/core';

    export class LoginPage extends BasePage {
    	readonly emailInput: Locator;
    	readonly passwordInput: Locator;
    	readonly submitButton: Locator;

    	constructor(page: Page) {
    		super(page);
    		this.emailInput = page.getByTestId('login-email-input');
    		this.passwordInput = page.getByTestId('login-password-input');
    		this.submitButton = page.getByTestId('login-submit-button');
    	}

    	async visit() {
    		await this.page.goto('/login');
    	}

    	async login(email: string, password: string) {
    		await this.emailInput.fill(email);
    		await this.passwordInput.fill(password);
    		await this.submitButton.click();
    	}

    	async verifyOnLoginPage() {
    		await expect(this.emailInput).toBeVisible();
    	}
    }
    ```

### 5. Module Fixture (`tests/fe/auth/auth.fixture.ts`)

- Extend `test` from `tests/fe/fe.fixture.ts`.

    ```typescript
    import { test as base } from '../fe.fixture';
    import { LoginPage } from './(login)';

    type AuthFixtures = {
    	loginPage: LoginPage;
    };

    export const test = base.extend<AuthFixtures>({
    	loginPage: async ({ page }, use) => {
    		await use(new LoginPage(page));
    	},
    });

    export { expect } from '../fe.fixture';
    ```

### 6. Barrel Exports

- `tests/fe/auth/(login)/index.ts`: Export `LoginPage`, `LOGIN_CREDENTIALS`.
- `tests/fe/auth/index.ts`: Export `auth.fixture`, `login` sub-module.

### 7. Test Specifications (`tests/fe/auth/(login)/login.spec.ts`)

- Import `test` from `../auth.fixture`.

    ```typescript
    import { expect, test } from '../auth.fixture';
    import { LOGIN_CREDENTIALS } from './index';

    test.describe('Login Feature', () => {
    	test('Should login successfully', async ({ loginPage }) => {
    		await loginPage.visit();
    		await loginPage.verifyOnLoginPage();
    		await loginPage.login(LOGIN_CREDENTIALS.EMAIL, LOGIN_CREDENTIALS.PASSWORD);
    		// Verify redirection (e.g., check URL or dashboard element)
    		await expect(loginPage.page).not.toHaveURL(/.*login/);
    	});
    });
    ```
