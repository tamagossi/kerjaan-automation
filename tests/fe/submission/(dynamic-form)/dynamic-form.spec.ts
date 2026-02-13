import { ROUTES } from '../../shared/constants';
import { expect, test } from '../submission.fixture';
import {
	BLACLISTED_CREDENTIALS,
	NON_BLACKLISTED_CREDENTIALS,
	WHITELISTED_CREDENTIALS,
} from './dynamic-form.constant';

test.describe('PK136 Epic 1 - Form template List Creation & Initiation', () => {
	test('TS.1: Whitelisted user sees Task Operations and Form menu', async ({
		loginPage,
		dynamicFormPage,
	}) => {
		await loginPage.visit();
		await loginPage.login(WHITELISTED_CREDENTIALS.EMAIL, WHITELISTED_CREDENTIALS.PASSWORD);
		await loginPage.waitForChangeRoute();

		/**
		 * Seems like we need to wait for the change route before navigateToSettings
		 */
		await dynamicFormPage.navigateToSettings();
		await dynamicFormPage.verifyTaskOperationsVisible();

		/**
		 * TODO:
		 * 1. visit /settings/task-operation
		 * 2. make sure Form menu is visible
		 */
	});

	test('TS.2: Non-whitelisted user sees Task Ops but NOT Form menu', async ({
		// loginPage,
		// dynamicFormPage,
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
		dynamicFormPage,
		page,
	}) => {
		await loginPage.visit();
		await loginPage.login(BLACLISTED_CREDENTIALS.EMAIL, BLACLISTED_CREDENTIALS.PASSWORD);
		await loginPage.waitForChangeRoute();

		await dynamicFormPage.verifyLegacyFormMenuHidden();

		await page.goto(ROUTES.LEGACY.FORM_TEMPLATE);
		await expect(page).toHaveURL(new RegExp(ROUTES.NO_ACCESS));

		await page.goto(ROUTES.LEGACY.FORM_ASSIGNMENT);
		await expect(page).toHaveURL(new RegExp(ROUTES.NO_ACCESS));
	});

	test('TS.4: Non-blacklisted user can access legacy pages', async ({
		loginPage,
		dynamicFormPage,
		page,
	}) => {
		await loginPage.visit();
		await loginPage.login(
			NON_BLACKLISTED_CREDENTIALS.EMAIL,
			NON_BLACKLISTED_CREDENTIALS.PASSWORD
		);
		await loginPage.waitForChangeRoute();

		await dynamicFormPage.verifyLegacyFormMenuVisible();

		await page.goto(ROUTES.LEGACY.FORM_TEMPLATE);
		await expect(page).toHaveURL(new RegExp(ROUTES.LEGACY.FORM_TEMPLATE));
	});
});
