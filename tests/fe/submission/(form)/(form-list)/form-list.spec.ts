import { loadEnvConfig } from '@/src/config';
import { ROUTES } from '@/tests/fe/shared/constants';

import { expect, test } from './form-list.fixture';

const env = loadEnvConfig();

test.describe('PK136 Epic 1 - Form template List Creation & Initiation', () => {
	test('TS.1: Whitelisted user sees Task Operations and Form menu', async ({
		loginPage,
		formListPage,
	}) => {
		await loginPage.visit();
		await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);

		await formListPage.navigateToSettings();
		await formListPage.verifyTaskOperationsVisible();
	});

	test('TS.2: Non-whitelisted user sees Task Ops but NOT Form menu', async ({
		// loginPage,
		// formListPage,
	}) => {
		/**
		 * TODO:
		 *
		 * 1. will provide the account later
		 * 2. make sure the task operations is visible but when it redirect to task operations page, the form menu is not visible
		 */
	});

	test('TS.3: Blacklisted user cannot access legacy pages', async ({
		loginPage,
		formListPage,
		page,
	}) => {
		await loginPage.visit();
		await loginPage.login(env.PK136_BLACKLISTED_EMAIL, env.PK136_BLACKLISTED_PASSWORD);

		await formListPage.verifyLegacyFormMenuHidden();

		await page.goto(ROUTES.LEGACY.FORM_TEMPLATE);
		await expect(page).toHaveURL(new RegExp(ROUTES.NO_ACCESS));

		await page.goto(ROUTES.LEGACY.FORM_ASSIGNMENT);
		await expect(page).toHaveURL(new RegExp(ROUTES.NO_ACCESS));
	});

	test('TS.4: Non-blacklisted user can access legacy pages', async ({
		loginPage,
		formListPage,
		page,
	}) => {
		await loginPage.visit();
		await loginPage.login(env.PK136_NON_BLACKLISTED_EMAIL, env.PK136_NON_BLACKLISTED_PASSWORD);

		await formListPage.verifyLegacyFormMenuVisible();

		await page.goto(ROUTES.LEGACY.FORM_TEMPLATE);
		await expect(page).toHaveURL(new RegExp(ROUTES.LEGACY.FORM_TEMPLATE));
	});
});
