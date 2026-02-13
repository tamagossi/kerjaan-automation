import { test as base } from '../fe.fixture';
import { LoginPage } from './(login)';

type AuthFixtures = {
	loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
});

export { expect } from '../fe.fixture';
