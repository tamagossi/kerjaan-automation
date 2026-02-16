import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '@/src/core';

export class FormListPage extends BasePage {
	readonly taskOperationSettingMenu: Locator;
	readonly digitalFormMenu: Locator;

	constructor(page: Page) {
		super(page);
		this.taskOperationSettingMenu = page.getByText('Task Operations');
		this.digitalFormMenu = page.getByText('Digital Form');
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
}
