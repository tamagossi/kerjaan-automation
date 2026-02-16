import { loadEnvConfig } from '@/src/config';
import { ROUTES } from '@/tests/fe/shared/constants';

import { expect, test } from './form-creation-step-1.fixture';

const env = loadEnvConfig();

test.describe('PK136 Epic 2 - Form Creation - Basic Information', () => {
	test.describe('C.5.1 - Form Creation Setup', () => {
		test('TS.1: Form creation stepper displays correctly on page load', async ({
			loginPage,
			formCreationStep1Page,
		}) => {
			await loginPage.visit();
			await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);
			await loginPage.waitForChangeRoute();

			await formCreationStep1Page.navigateToFormCreation();
			await formCreationStep1Page.verifyStepperVisible();
			await formCreationStep1Page.verifyAllStepsVisible();
			await formCreationStep1Page.verifyStepContentDisplayed('Basic Configuration Content');
		});

		test('TS.2: Leave confirmation modal - Cancel action keeps user on page', async ({
			loginPage,
			formCreationStep1Page,
			page,
		}) => {
			await loginPage.visit();
			await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);
			await loginPage.waitForChangeRoute();

			await formCreationStep1Page.navigateToFormCreation();
			await formCreationStep1Page.clickLeaveButton();
			await formCreationStep1Page.verifyLeaveModalVisible();

			await expect(formCreationStep1Page.leaveModalContentTitle).toHaveText(
				'Are you sure you want to leave this page?'
			);

			await formCreationStep1Page.clickCancelInLeaveModal();
			await formCreationStep1Page.verifyLeaveModalHidden();
			await expect(page).toHaveURL(
				new RegExp(ROUTES.SUBMISSIONS.TASK_OPERATIONS.DIGITAL_FORMS.CREATE)
			);

			await formCreationStep1Page.verifyStepperVisible();
		});

		test('TS.3: Leave confirmation modal - Leave action redirects to form list', async ({
			loginPage,
			formCreationStep1Page,
			page,
		}) => {
			await loginPage.visit();
			await loginPage.login(env.CRED_MAIN_EMAIL, env.CRED_MAIN_PASSWORD);
			await loginPage.waitForChangeRoute();

			await formCreationStep1Page.navigateToFormCreation();
			await formCreationStep1Page.clickLeaveButton();
			await formCreationStep1Page.verifyLeaveModalVisible();
			await formCreationStep1Page.clickLeaveInLeaveModal();

			await expect(page).toHaveURL(
				new RegExp(ROUTES.SUBMISSIONS.TASK_OPERATIONS.DIGITAL_FORMS.LIST)
			);
		});
	});

	test.describe('C.6.1 - Basic Information Form', () => {});
});
