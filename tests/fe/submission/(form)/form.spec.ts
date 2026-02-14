import { loadEnvConfig } from '@/src/config';

import { ROUTES } from '../../shared/constants';
import { expect, test } from '../submission.fixture';

const env = loadEnvConfig();

test.describe('PK136 Epic 1 - Form template List Creation & Initiation', () => {
	test('TS.1: Whitelisted user sees Task Operations and Form menu', async ({
		loginPage,
		dynamicFormPage,
	}) => {
		await loginPage.visit();
		await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);

		await dynamicFormPage.navigateToSettings();
		await dynamicFormPage.verifyTaskOperationsVisible();
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
		await loginPage.login(env.PK136_BLACKLISTED_EMAIL, env.PK136_BLACKLISTED_PASSWORD);

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
		await loginPage.login(env.PK136_NON_BLACKLISTED_EMAIL, env.PK136_NON_BLACKLISTED_PASSWORD);

		await dynamicFormPage.verifyLegacyFormMenuVisible();

		await page.goto(ROUTES.LEGACY.FORM_TEMPLATE);
		await expect(page).toHaveURL(new RegExp(ROUTES.LEGACY.FORM_TEMPLATE));
	});
});

test.describe('PK136 Epic 2 - Form Creation - Basic Information', () => {
	test('TS.1: Form creation stepper displays correctly on page load', async ({
		loginPage,
		dynamicFormPage,
	}) => {
		await loginPage.visit();
		await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);
		await loginPage.waitForChangeRoute();

		await dynamicFormPage.navigateToFormCreation();
		await dynamicFormPage.verifyStepperVisible();
		await dynamicFormPage.verifyAllStepsVisible();
		await dynamicFormPage.verifyStepContentDisplayed('Basic Configuration Content');
	});

	test('TS.2: Leave confirmation modal - Cancel action keeps user on page', async ({
		loginPage,
		dynamicFormPage,
		page,
	}) => {
		await loginPage.visit();
		await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);
		await loginPage.waitForChangeRoute();

		await dynamicFormPage.navigateToFormCreation();
		await dynamicFormPage.clickLeaveButton();
		await dynamicFormPage.verifyLeaveModalVisible();

		await expect(dynamicFormPage.leaveModalContentTitle).toHaveText(
			'Are you sure you want to leave this page?'
		);

		await dynamicFormPage.clickCancelInLeaveModal();
		await dynamicFormPage.verifyLeaveModalHidden();
		await expect(page).toHaveURL(
			new RegExp(ROUTES.SUBMISSIONS.TASK_OPERATIONS.DIGITAL_FORMS.CREATE)
		);

		await dynamicFormPage.verifyStepperVisible();
	});

	test('TS.3: Leave confirmation modal - Leave action redirects to form list', async ({
		loginPage,
		dynamicFormPage,
		page,
	}) => {
		await loginPage.visit();
		await loginPage.login(env.CRED_MAIN_EMAIL, env.CRED_MAIN_PASSWORD);
		await loginPage.waitForChangeRoute();

		await dynamicFormPage.navigateToFormCreation();
		await dynamicFormPage.clickLeaveButton();
		await dynamicFormPage.verifyLeaveModalVisible();
		await dynamicFormPage.clickLeaveInLeaveModal();

		await expect(page).toHaveURL(
			new RegExp(ROUTES.SUBMISSIONS.TASK_OPERATIONS.DIGITAL_FORMS.LIST)
		);
	});
});
