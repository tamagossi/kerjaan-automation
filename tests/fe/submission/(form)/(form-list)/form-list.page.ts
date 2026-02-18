import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '@/src/core';

export class FormListPage extends BasePage {
	readonly digitalFormMenu: Locator;
	readonly formMenu: Locator;
	readonly taskOperationSettingMenu: Locator;

	constructor(page: Page) {
		super(page);
		this.digitalFormMenu = page.getByText('Digital Form');
		this.formMenu = page.getByText('Form');
		this.taskOperationSettingMenu = page.getByTestId('settings-task_operations-button');
	}

	async navigateToSettings() {
		await this.page.goto('/settings');
	}

	async navigateToTaskOperations() {
		await this.taskOperationSettingMenu.click();
	}

	async verifyTaskOperationsVisible() {
		await expect(this.taskOperationSettingMenu).toBeVisible();
	}

	async verifyLegacyFormMenuHidden() {
		await expect(this.formMenu).toBeHidden();
	}

	async verifyLegacyFormMenuVisible() {
		await expect(this.digitalFormMenu).toBeVisible();
	}

	async verifyFormMenuHidden() {
		await expect(this.digitalFormMenu).toBeHidden();
	}
}
