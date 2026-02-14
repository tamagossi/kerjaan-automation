import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '@/src/core';

export class DynamicFormPage extends BasePage {
	readonly taskOperationSettingMenu: Locator;
	readonly digitalFormMenu: Locator;

	// Form Creation Page Locators
	readonly stepperComponent: Locator;
	readonly step1Button: Locator;
	readonly step2Button: Locator;
	readonly step3Button: Locator;
	readonly step4Button: Locator;
	readonly step5Button: Locator;
	readonly leaveButton: Locator;
	readonly leaveModalTitle: Locator;
	readonly leaveModalCancelButton: Locator;
	readonly leaveModalLeaveButton: Locator;
	readonly leaveModalContentTitle: Locator;

	constructor(page: Page) {
		super(page);
		this.taskOperationSettingMenu = page.getByText('Task Operations');
		this.digitalFormMenu = page.getByText('Digital Form');

		// Stepper locators
		this.stepperComponent = page.getByTestId('form-creation-stepper');
		this.step1Button = page.getByTestId('create_form-stepper_1-basic_configuration-button');
		this.step2Button = page.getByTestId('create_form-stepper_2-form_builder-button');
		this.step3Button = page.getByTestId('create_form-stepper_3-logic_jump-button');
		this.step4Button = page.getByTestId('create_form-stepper_4-preview-button');
		this.step5Button = page.getByTestId('create_form-stepper_5-form_assignment-button');

		// Leave button locators
		this.leaveButton = page.getByTestId('create_form-leave-button');

		// Leave modal locators
		this.leaveModalTitle = page.getByTestId('form-creation-leave-confirmation-modal-title');
		this.leaveModalCancelButton = page.getByTestId(
			'form-creation-leave-confirmation-modal-cancel-btn'
		);
		this.leaveModalLeaveButton = page.getByTestId(
			'form-creation-leave-confirmation-modal-leave-btn'
		);
		this.leaveModalContentTitle = page.getByTestId(
			'form-creation-leave-confirmation-modal-content-title'
		);
	}

	async navigateToSettings() {
		await this.page.goto('/settings');
	}

	async verifyTaskOperationsVisible() {
		await expect(this.taskOperationSettingMenu).toBeVisible();
	}

	async verifyLegacyFormMenuHidden() {
		await expect(this.digitalFormMenu).toBeHidden();
	}

	async verifyLegacyFormMenuVisible() {
		await expect(this.digitalFormMenu).toBeVisible();
	}

	async navigateToFormCreation() {
		await this.page.goto('/settings/task-operations/forms/create');
	}

	async navigateToFormList() {
		await this.page.goto('/settings/task-operations/forms');
	}

	async clickLeaveButton() {
		await this.leaveButton.click();
	}

	async verifyStepperVisible() {
		await expect(this.stepperComponent).toBeVisible();
	}

	async verifyAllStepsVisible() {
		await expect(this.step1Button).toBeVisible();
		await expect(this.step2Button).toBeVisible();
		await expect(this.step3Button).toBeVisible();
		await expect(this.step4Button).toBeVisible();
		await expect(this.step5Button).toBeVisible();
	}

	async verifyStepDisabled(stepNumber: number) {
		const stepButtonMap = {
			2: this.step2Button,
			3: this.step3Button,
			4: this.step4Button,
			5: this.step5Button,
		};
		const stepButton = stepButtonMap[stepNumber as keyof typeof stepButtonMap];
		await expect(stepButton).toBeDisabled();
	}

	async verifyStepContentDisplayed(expectedText: string) {
		await expect(this.page.getByText(expectedText)).toBeVisible();
	}

	async verifyLeaveModalVisible() {
		await expect(this.leaveModalTitle).toBeVisible();
	}

	async verifyLeaveModalHidden() {
		await expect(this.leaveModalTitle).toBeHidden();
	}

	async clickCancelInLeaveModal() {
		await this.leaveModalCancelButton.click();
	}

	async clickLeaveInLeaveModal() {
		await this.leaveModalLeaveButton.click();
	}
}
