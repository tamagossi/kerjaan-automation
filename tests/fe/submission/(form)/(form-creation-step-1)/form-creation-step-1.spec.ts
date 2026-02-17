import { loadEnvConfig } from '@/src/config';
import { ROUTES } from '@/tests/fe/shared/constants';

import { createBasicInformationData, createLongText } from './form-creation-step-1.data';
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
			await formCreationStep1Page.verifyStepContentDisplayed('Basic Information');
		});

		test('TS.4: All fields start in default empty state on first load', async ({
			loginPage,
			formCreationStep1Page,
		}) => {
			await loginPage.visit();
			await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);
			await loginPage.waitForChangeRoute();

			await formCreationStep1Page.navigateToFormCreation();

			await expect(formCreationStep1Page.formNameInput).toBeEmpty();
			await expect(formCreationStep1Page.formDescriptionTextarea).toBeEmpty();
			await expect(formCreationStep1Page.trainingMaterialToggle).not.toBeChecked();
			await expect(formCreationStep1Page.editableSubmissionToggle).not.toBeChecked();
			await expect(formCreationStep1Page.needsApprovalToggle).not.toBeChecked();
			await expect(formCreationStep1Page.setAsTemporaryToggle).not.toBeChecked();
			await expect(formCreationStep1Page.setLimitToggle).not.toBeChecked();

			await formCreationStep1Page.verifyTrainingFieldsHidden();
			await formCreationStep1Page.verifyActivePeriodFieldsHidden();
			await formCreationStep1Page.verifyLimitFieldsHidden();
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

	test.describe('C.6.1 - Basic Information Form', () => {
		test.beforeEach(async ({ loginPage, formCreationStep1Page }) => {
			await loginPage.visit();
			await loginPage.login(env.PK136_WHITELISTED_EMAIL, env.PK136_WHITELISTED_PASSWORD);
			await formCreationStep1Page.navigateToFormCreation();
		});

		test('TC.1: Form Template Name and Description fields accept valid input', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.fillFormDescription(testData.formDescription);

			await expect(formCreationStep1Page.formNameInput).toHaveValue(testData.formName);
			await expect(formCreationStep1Page.formDescriptionTextarea).toHaveValue(
				testData.formDescription
			);
		});

		test('TC.2: Form Template Name is required and blocks progression', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormDescription(testData.formDescription);
			await formCreationStep1Page.verifyNextButtonDisabled();

			await formCreationStep1Page.formNameInput.fill('Test');
			await formCreationStep1Page.formNameInput.clear();
			await formCreationStep1Page.formNameInput.blur();

			await formCreationStep1Page.verifyFieldError(
				'Please provide data in the required field.'
			);
		});

		test('TC.2.1: Form Template Name validates maximum character limit', async ({
			formCreationStep1Page,
		}) => {
			const longFormName = createLongText(250);

			await formCreationStep1Page.fillFormName(longFormName);

			const inputValue = await formCreationStep1Page.formNameInput.inputValue();
			await expect(inputValue.length).toBeLessThanOrEqual(250);
		});

		test('TC.2.2: Form Template Description validates maximum character limit', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();
			const longDescription = createLongText(1000);

			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.fillFormDescription(longDescription);

			const inputValue = await formCreationStep1Page.formDescriptionTextarea.inputValue();
			await expect(inputValue.length).toBeLessThanOrEqual(1000);

			await formCreationStep1Page.verifyNextButtonEnabled();
		});

		test('TC.3: Training Material toggle shows/hides dependent fields', async ({
			formCreationStep1Page,
		}) => {
			await formCreationStep1Page.verifyTrainingFieldsHidden();
			await formCreationStep1Page.toggleTrainingMaterial(true);
			await formCreationStep1Page.verifyTrainingFieldsVisible();
			await formCreationStep1Page.toggleTrainingMaterial(false);
			await formCreationStep1Page.verifyTrainingFieldsHidden();
		});

		test('TC.4: Training Material fields are required when toggle is Yes', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.toggleTrainingMaterial(true);
			await formCreationStep1Page.verifyNextButtonDisabled();
		});

		test('TC.5: Training Material fields validation - character limits', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();
			const longTitle = createLongText(140);
			const longDescription = createLongText(250);

			await formCreationStep1Page.fillFormName(testData.formName);

			await formCreationStep1Page.toggleTrainingMaterial(true);

			await formCreationStep1Page.fillTrainingTitle(longTitle);
			await formCreationStep1Page.fillTrainingDescription(longDescription);
			await formCreationStep1Page.fillTrainingVideoUrl(testData.trainingVideoUrl);

			await expect(formCreationStep1Page.trainingTitleInput).toHaveValue(longTitle);
			await expect(formCreationStep1Page.trainingVideoUrlInput).toHaveValue(
				testData.trainingVideoUrl
			);

			await formCreationStep1Page.verifyNextButtonEnabled();
		});

		test('TC.6: Editable Submission toggle default state is No and disabled', async ({
			formCreationStep1Page,
		}) => {
			await formCreationStep1Page.verifyEditableSubmissionDisabled();
			await formCreationStep1Page.verifyEditableSubmissionUnchecked();
		});

		test('TC.7: Need Approval toggle default state is No and disabled', async ({
			formCreationStep1Page,
		}) => {
			await formCreationStep1Page.verifyNeedsApprovalDisabled();
			await formCreationStep1Page.verifyNeedsApprovalUnchecked();
		});

		test('TC.8: Set as Temporary toggle shows/hides Active Period fields', async ({
			formCreationStep1Page,
		}) => {
			await formCreationStep1Page.verifyActivePeriodFieldsHidden();
			await formCreationStep1Page.toggleSetAsTemporary(true);
			await formCreationStep1Page.verifyActivePeriodFieldsVisible();
			await formCreationStep1Page.toggleSetAsTemporary(false);

			await formCreationStep1Page.verifyActivePeriodFieldsHidden();
		});

		test('TC.9: Set Limit toggle shows/hides limit configuration fields', async ({
			formCreationStep1Page,
		}) => {
			await formCreationStep1Page.verifyLimitFieldsHidden();
			await formCreationStep1Page.toggleSetLimit(true);
			await formCreationStep1Page.verifyLimitFieldsVisible();
			await formCreationStep1Page.toggleSetLimit(false);
			await formCreationStep1Page.verifyLimitFieldsHidden();
		});

		test('TC.10: Set Limit configuration validation - positive integer required', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.toggleSetLimit(true);
			await formCreationStep1Page.selectLimitBasedOn('Day');
			await formCreationStep1Page.fillLimitValue(10);
			await expect(formCreationStep1Page.limitValueInput).toHaveValue('10');
			await formCreationStep1Page.verifyNextButtonEnabled();
		});

		test('TC.11: Next button is disabled when mandatory fields incomplete', async ({
			formCreationStep1Page,
		}) => {
			await formCreationStep1Page.verifyNextButtonDisabled();
			const testData = createBasicInformationData();
			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.verifyNextButtonEnabled();
		});

		test('TC.12: Next button is enabled when all mandatory fields complete', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.verifyNextButtonEnabled();
		});

		test('TC.13: Complete form with all sections filled', async ({ formCreationStep1Page }) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.fillFormDescription(testData.formDescription);

			await formCreationStep1Page.toggleTrainingMaterial(true);
			await formCreationStep1Page.fillTrainingTitle(testData.trainingTitle);
			await formCreationStep1Page.fillTrainingDescription(testData.trainingDescription);
			await formCreationStep1Page.fillTrainingVideoUrl(testData.trainingVideoUrl);

			await formCreationStep1Page.toggleSetLimit(true);
			await formCreationStep1Page.selectLimitBasedOn('Form');
			await formCreationStep1Page.fillLimitValue(100);

			await formCreationStep1Page.verifyNextButtonEnabled();
		});

		test('TC.14: Training Material with all optional fields filled', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormName(testData.formName);

			await formCreationStep1Page.toggleTrainingMaterial(true);

			await formCreationStep1Page.fillTrainingTitle(testData.trainingTitle);
			await formCreationStep1Page.fillTrainingDescription(testData.trainingDescription);
			await formCreationStep1Page.fillTrainingVideoUrl(testData.trainingVideoUrl);

			await formCreationStep1Page.verifyNextButtonEnabled();
		});

		test('TC.15: Limit Based On can toggle between Day and Form options', async ({
			formCreationStep1Page,
		}) => {
			const testData = createBasicInformationData();

			await formCreationStep1Page.fillFormName(testData.formName);
			await formCreationStep1Page.toggleSetLimit(true);

			await formCreationStep1Page.selectLimitBasedOn('Day');
			await expect(formCreationStep1Page.limitBasedOnDayRadio).toBeChecked();

			await formCreationStep1Page.selectLimitBasedOn('Form');
			await expect(formCreationStep1Page.limitBasedOnFormRadio).toBeChecked();
			await expect(formCreationStep1Page.limitBasedOnDayRadio).not.toBeChecked();
		});
	});
});
