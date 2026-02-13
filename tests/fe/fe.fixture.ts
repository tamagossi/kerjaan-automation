import { Page } from '@playwright/test';

import { expect, test as base } from '@/src/core';
import { getStorageState } from '@/src/helpers';

type FeFixtures = {
	authenticatedPage: Page;
};

export const test = base.extend<FeFixtures>({
	authenticatedPage: async ({ browser, envConfig }, use) => {
		const statePath = await getStorageState(envConfig.FE_BASE_URL);
		const context = await browser.newContext({
			baseURL: envConfig.FE_BASE_URL,
			storageState: statePath,
		});
		const page = await context.newPage();
		await use(page);
		await context.close();
	},
});

export { expect };
