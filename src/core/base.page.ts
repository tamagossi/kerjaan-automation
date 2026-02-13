import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
	constructor(protected readonly page: Page) {}

	async navigate(path: string): Promise<void> {
		await this.page.goto(path);
	}

	async waitForPageLoad(): Promise<void> {
		await this.page.waitForLoadState('networkidle');
	}

	async fillInput(locator: Locator, value: string): Promise<void> {
		await locator.clear();
		await locator.fill(value);
	}

	async expectUrl(pattern: string | RegExp): Promise<void> {
		await expect(this.page).toHaveURL(pattern);
	}

	async expectVisible(locator: Locator): Promise<void> {
		await expect(locator).toBeVisible();
	}

	async expectText(locator: Locator, text: string): Promise<void> {
		await expect(locator).toHaveText(text);
	}

	async takeScreenshot(name: string): Promise<void> {
		await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
	}
}
