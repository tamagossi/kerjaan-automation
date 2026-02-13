import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '@/src/core';

export class LoginPage extends BasePage {
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;

	constructor(page: Page) {
		super(page);
		this.emailInput = page.getByTestId('login-email-input');
		this.passwordInput = page.getByTestId('login-password-input');
		this.submitButton = page.getByTestId('login-submit-button');
	}

	async visit() {
		await this.page.goto('/login');
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
	}

	async verifyOnLoginPage() {
		await expect(this.emailInput).toBeVisible();
	}
}
