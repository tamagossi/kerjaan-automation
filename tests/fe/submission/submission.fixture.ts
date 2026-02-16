import { LoginPage } from '@/tests/fe/auth/(login)';
import { test as base } from '@/tests/fe/fe.fixture';

type SubmissionFixtures = {
	loginPage: LoginPage;
};

export const test = base.extend<SubmissionFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
});

export { expect } from '@/tests/fe/fe.fixture';
