import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '@/src/core';

export class FormCreationStep1Page extends BasePage {
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

	// Basic Information Fields
	readonly formNameInput: Locator;
	readonly formDescriptionTextarea: Locator;
	readonly nextButton: Locator;

	// Training Material Section
	readonly trainingMaterialToggle: Locator;
	readonly trainingTitleInput: Locator;
	readonly trainingAttachmentPicker: Locator;
	readonly trainingVideoUrlInput: Locator;
	readonly trainingDescriptionEditor: Locator;

	// Modification & Approval Section
	readonly editableSubmissionToggle: Locator;
	readonly needsApprovalToggle: Locator;

	// Form Availability & Target Section
	readonly setAsTemporaryToggle: Locator;
	readonly activePeriodInputGroup: Locator;
	readonly setLimitToggle: Locator;
	readonly limitBasedOnDayRadio: Locator;
	readonly limitBasedOnFormRadio: Locator;
	readonly limitValueInput: Locator;

	constructor(page: Page) {
		super(page);
		this.stepperComponent = page.getByTestId('form-creation-stepper');
		this.step1Button = page.getByTestId('create_form-stepper_1-basic_configuration-button');
		this.step2Button = page.getByTestId('create_form-stepper_2-form_builder-button');
		this.step3Button = page.getByTestId('create_form-stepper_3-logic_jump-button');
		this.step4Button = page.getByTestId('create_form-stepper_4-preview-button');
		this.step5Button = page.getByTestId('create_form-stepper_5-form_assignment-button');
		this.leaveButton = page.getByTestId('create_form-leave-button');
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

		// Basic Information Fields
		this.formNameInput = page.getByTestId(
			'create_form-step_1-basic_information-form_name-textarea'
		);
		this.formDescriptionTextarea = page.getByTestId(
			'create_form-step_1-basic_information-form_description-textarea'
		);
		this.nextButton = page.getByTestId('create_form-step_1-basic_information-next-button');

		// Training Material Section
		this.trainingMaterialToggle = page.getByTestId(
			'create_form-step_1-training_material-training_material-switch'
		);
		this.trainingTitleInput = page.getByTestId(
			'create_form-step_1-training_material-training_title-textarea'
		);
		this.trainingAttachmentPicker = page.getByTestId(
			'create_form-step_1-training_material-training_attachment-file_picker'
		);
		this.trainingVideoUrlInput = page.getByTestId(
			'create_form-step_1-training_material-training_video_url-textfield'
		);
		this.trainingDescriptionEditor = page.getByRole('textbox', { name: 'rdw-editor' });

		// Modification & Approval Section
		this.editableSubmissionToggle = page.getByTestId('editable-submission-toggle');
		this.needsApprovalToggle = page.getByTestId('needs-approval-toggle');

		// Form Availability & Target Section
		this.setAsTemporaryToggle = page.getByTestId(
			'create_form-step_1-form_availability-set_as_temporary-switch'
		);
		this.activePeriodInputGroup = page.getByTestId('active-period-input-wrapper');
		this.setLimitToggle = page.getByTestId(
			'create_form-step_1-form_availability-set_limit-switch'
		);
		this.limitBasedOnDayRadio = page
			.getByTestId('create_form-step_1-form_availability-limit_based_on-form-radio')
			.getByText('Day');
		this.limitBasedOnFormRadio = page
			.getByTestId('create_form-step_1-form_availability-limit_based_on-form-radio')
			.getByText('Form');
		this.limitValueInput = page.getByTestId(
			'create_form-step_1-form_availability-value-number'
		);
	}

	async navigateToFormCreation() {
		await this.page.goto('/settings/task-operations/forms/create');
	}

	async clickLeaveButton() {
		await this.leaveButton.scrollIntoViewIfNeeded();
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
		await this.leaveModalCancelButton.scrollIntoViewIfNeeded();
		await this.leaveModalCancelButton.click();
	}

	async clickLeaveInLeaveModal() {
		await this.leaveModalLeaveButton.scrollIntoViewIfNeeded();
		await this.leaveModalLeaveButton.click();
	}

	// Basic Information Fields Methods
	async fillFormName(formName: string) {
		await this.formNameInput.scrollIntoViewIfNeeded();
		await this.formNameInput.fill(formName);
	}

	async fillFormDescription(description: string) {
		await this.formDescriptionTextarea.scrollIntoViewIfNeeded();
		await this.formDescriptionTextarea.fill(description);
	}

	async verifyNextButtonDisabled() {
		await expect(this.nextButton).toBeDisabled();
	}

	async verifyNextButtonEnabled() {
		await expect(this.nextButton).toBeEnabled();
	}

	async clickNextButton() {
		await this.nextButton.scrollIntoViewIfNeeded();
		await this.nextButton.click();
	}

	async verifyFieldError(errorMessage: string) {
		const errorLocator = this.page.getByText(errorMessage);
		await expect(errorLocator).toBeVisible();
	}

	// Training Material Methods
	async toggleTrainingMaterial(enable: boolean) {
		const isChecked = await this.trainingMaterialToggle.isChecked();
		if ((enable && !isChecked) || (!enable && isChecked)) {
			await this.trainingMaterialToggle.scrollIntoViewIfNeeded();
			await this.trainingMaterialToggle.click();
		}
	}

	async verifyTrainingFieldsVisible() {
		await expect(this.trainingTitleInput).toBeVisible();
		await expect(this.trainingAttachmentPicker).toBeVisible();
		await expect(this.trainingVideoUrlInput).toBeVisible();
		await expect(this.trainingDescriptionEditor).toBeVisible();
	}

	async verifyTrainingFieldsHidden() {
		await expect(this.trainingTitleInput).toBeHidden();
		await expect(this.trainingAttachmentPicker).toBeHidden();
		await expect(this.trainingVideoUrlInput).toBeHidden();
		await expect(this.trainingDescriptionEditor).toBeHidden();
	}

	async fillTrainingTitle(title: string) {
		await this.trainingTitleInput.scrollIntoViewIfNeeded();
		await this.trainingTitleInput.fill(title);
	}

	async fillTrainingVideoUrl(url: string) {
		await this.trainingVideoUrlInput.scrollIntoViewIfNeeded();
		await this.trainingVideoUrlInput.fill(url);
	}

	async fillTrainingDescription(description: string) {
		// For Draft.js editor, we need to click into it and type
		await this.trainingDescriptionEditor.scrollIntoViewIfNeeded();
		await this.trainingDescriptionEditor.click();
		await this.trainingDescriptionEditor.fill(description);
	}

	// Modification & Approval Methods
	async verifyEditableSubmissionDisabled() {
		await expect(this.editableSubmissionToggle).toBeDisabled();
	}

	async verifyNeedsApprovalDisabled() {
		await expect(this.needsApprovalToggle).toBeDisabled();
	}

	async verifyEditableSubmissionUnchecked() {
		await expect(this.editableSubmissionToggle).not.toBeChecked();
	}

	async verifyNeedsApprovalUnchecked() {
		await expect(this.needsApprovalToggle).not.toBeChecked();
	}

	// Form Availability Methods
	async toggleSetAsTemporary(enable: boolean) {
		const isChecked = await this.setAsTemporaryToggle.isChecked();
		if ((enable && !isChecked) || (!enable && isChecked)) {
			await this.setAsTemporaryToggle.scrollIntoViewIfNeeded();
			await this.setAsTemporaryToggle.click();
			// Wait for conditional render
			await this.page.waitForTimeout(500);
		}
	}

	async verifyActivePeriodFieldsVisible() {
		await expect(this.activePeriodInputGroup).toBeVisible();
	}

	async verifyActivePeriodFieldsHidden() {
		await expect(this.activePeriodInputGroup).toBeHidden();
	}

	async toggleSetLimit(enable: boolean) {
		const isChecked = await this.setLimitToggle.isChecked();
		if ((enable && !isChecked) || (!enable && isChecked)) {
			await this.setLimitToggle.scrollIntoViewIfNeeded();
			await this.setLimitToggle.click();
		}
	}

	async verifyLimitFieldsVisible() {
		await expect(this.limitBasedOnDayRadio).toBeVisible();
		await expect(this.limitBasedOnFormRadio).toBeVisible();
		await expect(this.limitValueInput).toBeVisible();
	}

	async verifyLimitFieldsHidden() {
		await expect(this.limitBasedOnDayRadio).toBeHidden();
		await expect(this.limitBasedOnFormRadio).toBeHidden();
		await expect(this.limitValueInput).toBeHidden();
	}

	async selectLimitBasedOn(type: 'Day' | 'Form') {
		if (type === 'Day') {
			await this.limitBasedOnDayRadio.scrollIntoViewIfNeeded();
			await this.limitBasedOnDayRadio.click();
		} else {
			await this.limitBasedOnFormRadio.scrollIntoViewIfNeeded();
			await this.limitBasedOnFormRadio.click();
		}
	}

	async fillLimitValue(value: number) {
		await this.limitValueInput.scrollIntoViewIfNeeded();
		await this.limitValueInput.fill(value.toString());
	}

	async waitForTimeout(ms: number) {
		await this.page.waitForTimeout(ms);
	}
}
