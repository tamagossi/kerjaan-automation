import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from '@/src/core';

import { ROUTES } from '../../shared/constants';

export class LoginPage extends BasePage {
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly errorMessage: Locator;

	constructor(page: Page) {
		super(page);
		this.emailInput = page.getByTestId('login-email-input');
		this.passwordInput = page.getByTestId('login-password-input');
		this.submitButton = page.getByTestId('login-submit-button');
		this.errorMessage = page.getByRole('alert');
	}

	async visit() {
		await this.page.goto('/login');
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
		await this.waitForChangeRoute();
	}

	async verifyOnLoginPage() {
		await expect(this.emailInput).toBeVisible();
	}

	async verifyErrorMessageVisible() {
		await expect(this.errorMessage).toBeVisible();
	}

	async waitForChangeRoute() {
		await this.page.waitForURL(ROUTES.EMPLOYEE);
	}
}
