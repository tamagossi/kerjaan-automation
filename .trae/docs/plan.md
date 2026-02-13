# Implement Login Automation Tests

> Context: Create automation tests for the Login page (`pages/login.tsx`) in the `auth` module.
>
> **Updates**:
>
> - **Local Execution**: Use `http://localhost:3000` for `FE_BASE_URL`.
> - **Credentials**: Store in `tests/fe/auth/(login)/login.constant.ts`.
> - **Storage State**: Implement `storageState` caching in `auth.helper.ts` and use it in `fe.fixture.ts` to share auth state across tests efficiently.
> - **Fixture Separation**: Ensure `loginPage` uses a clean `page` context (not authenticated), while `authenticatedPage` uses the stored state.

## Implement Dynamic Form Automation Tests

> Context: Automate feature flag and sidebar visibility tests for Dynamic Form (C.1.3 & C.1.4) in `submission/(dynamic-form)`.

> **Scenarios**:
>
> 1. **Whitelisted User** (`annisa.fajri+dev@staffinc.co`): Sidebar hidden initially, but Task Operations and Form menu should be visible.
> 2. **Non-Whitelisted User** (`asd@mailo.com`): Task Operations/Form menu should be hidden.

## Directory Structure

- Create directory `tests/fe/submission/(dynamic-form)`

## File Implementation Plan

### 1. Update Credentials (`tests/fe/auth/(login)/login.constant.ts`)

- Add `UNAUTHORIZED_CREDENTIALS` for `asd@mailo.com` to the existing constants.

    ```typescript
    export const LOGIN_CREDENTIALS = {
    	EMAIL: 'annisa.fajri+dev@staffinc.co',
    	PASSWORD: 'Asdasd123.',
    };

    export const UNAUTHORIZED_CREDENTIALS = {
    	EMAIL: 'asd@mailo.com',
    	PASSWORD: 'Asdasd123!',
    };
    ```

### 2. Page Object (`tests/fe/submission/(dynamic-form)/dynamic-form.page.ts`)

- Create `DynamicFormPage` class extending `BasePage`.
- Define locators for "Task Operations" and "Form Template" menus.
- Implement methods to:
    - Navigate to settings page.
    - Verify "Task Operations" is visible.
    - Click "Task Operations" and verify "Form Template" is visible.
    - Verify "Form Template" is hidden.

    ```typescript
    import { type Locator, type Page, expect } from '@playwright/test';
    import { BasePage } from '@/src/core';

    export class DynamicFormPage extends BasePage {
    	readonly taskOperationsMenu: Locator;
    	readonly formMenu: Locator;

    	constructor(page: Page) {
    		super(page);
    		// Adjust locators based on actual implementation
    		this.taskOperationsMenu = page.getByText('Task Operations');
    		this.formMenu = page.getByText('Form Template');
    	}

    	async navigateToSettings() {
    		await this.page.goto('/settings');
    	}

    	async navigateToFormTemplate() {
    		await this.page.goto('/submission/form-template'); // Adjust URL as needed
    	}

    	async verifyTaskOperationsVisible() {
    		await expect(this.taskOperationsMenu).toBeVisible();
    	}

    	async verifyFormMenuVisible() {
    		await this.taskOperationsMenu.click();
    		await expect(this.formMenu).toBeVisible();
    	}

    	async verifyFormMenuHidden() {
    		await expect(this.formMenu).toBeHidden();
    	}
    }
    ```

### 3. Module Fixture (`tests/fe/submission/submission.fixture.ts`)

- Create a new fixture for the submission module extending `fe.fixture.ts`.
- **Decision**: Use `loginPage` (unauthenticated context) instead of `authenticatedPage` to allow explicit login with different credentials for each scenario.
- Extend the fixture to include `dynamicFormPage` and `loginPage`.

    ```typescript
    import { test as base } from '../fe.fixture';
    import { DynamicFormPage } from './(dynamic-form)/dynamic-form.page';
    import { LoginPage } from '../auth/(login)/login.page';

    type SubmissionFixtures = {
    	dynamicFormPage: DynamicFormPage;
    	loginPage: LoginPage;
    };

    export const test = base.extend<SubmissionFixtures>({
    	loginPage: async ({ page }, use) => {
    		await use(new LoginPage(page));
    	},
    	dynamicFormPage: async ({ page }, use) => {
    		await use(new DynamicFormPage(page));
    	},
    });

    export { expect } from '../fe.fixture';
    ```

### 4. Barrel Exports

- Create `tests/fe/submission/(dynamic-form)/index.ts` to export the page, data, and fixture (if any).
- Create `tests/fe/submission/index.ts` to export the submission fixture.

### 5. Test Specifications (`tests/fe/submission/(dynamic-form)/dynamic-form.spec.ts`)

- **Scenario 1 (Whitelisted - Settings Visibility)**:
    - **Context**: Whitelisted users should see "Task Operations" and the new "Form Template" menu.
    - Visit login page (`localhost:3000`).
    - Login with `annisa.fajri+dev@staffinc.co`.
    - Navigate to `/settings`.
    - Assert "Task Operations" is visible.
    - Assert "Form Template" is visible.
- **Scenario 2 (Non-Whitelisted - Settings Visibility)**:
    - **Context**: Non-whitelisted users see "Task Operations" but NOT the "Form Template" menu.
    - Visit login page.
    - Login with `asd@mailo.com`.
    - Navigate to `/settings`.
    - Assert "Task Operations" is visible.
    - Assert "Form Template" is hidden.
- **Scenario 3 (Blacklisted - Legacy Forms)**:
    - **Context**: Blacklisted users (typically those whitelisted for the new feature) cannot see legacy forms in the sidebar and are redirected to `/no-access`.
    - Login with `annisa.fajri+dev@staffinc.co`.
    - Attempt to visit legacy URLs (`/digital-forms`, `/digital-forms/assignment`).
    - Assert redirect to `/no-access`.
- **Scenario 4 (Non-Blacklisted - Legacy Forms)**:
    - **Context**: Non-blacklisted users (those not on the new feature) retain access to legacy forms.
    - Login with `asd@mailo.com`.
    - Visit legacy URLs.
    - Assert access is granted.

    ```typescript
    import { expect, test } from '../submission.fixture';
    import {
    	LOGIN_CREDENTIALS,
    	UNAUTHORIZED_CREDENTIALS,
    } from '@/tests/fe/auth/(login)/login.constant';

    const ROUTES = {
    	SETTINGS: '/settings',
    	NO_ACCESS: '/no-access',
    	LEGACY_FORM: '/digital-forms',
    	LEGACY_ASSIGNMENT: '/digital-forms/assignment',
    };

    test.describe('Dynamic Form Feature Flags & Legacy Access', () => {
    	// Scenario 1: Whitelisted User (New Feature Access)
    	test('Scenario 1: Whitelisted user sees Task Operations and Form menu', async ({
    		loginPage,
    		dynamicFormPage,
    	}) => {
    		// Context: Whitelisted for New Feature
    		await loginPage.visit(); // localhost:3000
    		await loginPage.login(LOGIN_CREDENTIALS.EMAIL, LOGIN_CREDENTIALS.PASSWORD);

    		await dynamicFormPage.navigateToSettings();
    		await dynamicFormPage.verifyTaskOperationsVisible();
    		await dynamicFormPage.verifyFormMenuVisible();
    	});

    	// Scenario 2: Non-Whitelisted User (No New Feature Access)
    	test('Scenario 2: Non-whitelisted user sees Task Ops but NOT Form menu', async ({
    		loginPage,
    		dynamicFormPage,
    	}) => {
    		// Context: Non-Whitelisted for New Feature
    		await loginPage.visit();
    		await loginPage.login(
    			UNAUTHORIZED_CREDENTIALS.EMAIL,
    			UNAUTHORIZED_CREDENTIALS.PASSWORD
    		);

    		await dynamicFormPage.navigateToSettings();
    		await dynamicFormPage.verifyTaskOperationsVisible();
    		await dynamicFormPage.verifyFormMenuHidden();
    	});

    	// Scenario 3: Blacklisted User (Restricted from Legacy)
    	// Assuming Whitelisted for New = Blacklisted for Legacy (Migration)
    	test('Scenario 3: Blacklisted user cannot access legacy pages', async ({
    		loginPage,
    		dynamicFormPage,
    	}) => {
    		await loginPage.visit();
    		await loginPage.login(LOGIN_CREDENTIALS.EMAIL, LOGIN_CREDENTIALS.PASSWORD);

    		// Direct Access Check
    		await dynamicFormPage.page.goto(ROUTES.LEGACY_FORM);
    		await dynamicFormPage.expectUrl(new RegExp(ROUTES.NO_ACCESS));

    		await dynamicFormPage.page.goto(ROUTES.LEGACY_ASSIGNMENT);
    		await dynamicFormPage.expectUrl(new RegExp(ROUTES.NO_ACCESS));
    	});

    	// Scenario 4: Non-Blacklisted User (Allowed Legacy)
    	// Assuming Non-Whitelisted for New = Non-Blacklisted for Legacy
    	test('Scenario 4: Non-blacklisted user can access legacy pages', async ({
    		loginPage,
    		dynamicFormPage,
    	}) => {
    		await loginPage.visit();
    		await loginPage.login(
    			UNAUTHORIZED_CREDENTIALS.EMAIL,
    			UNAUTHORIZED_CREDENTIALS.PASSWORD
    		);

    		// Direct Access Check
    		await dynamicFormPage.page.goto(ROUTES.LEGACY_FORM);
    		await expect(dynamicFormPage.page).toHaveURL(new RegExp(ROUTES.LEGACY_FORM));
    	});
    });
    ```
