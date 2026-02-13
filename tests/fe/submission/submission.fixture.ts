import { LoginPage } from '../auth/(login)/login.page';
import { test as base } from '../fe.fixture';
import { DynamicFormPage } from './(form)/form.page';

type SubmissionFixtures = {
	dynamicFormPage: DynamicFormPage;
	loginPage: LoginPage;
};

export const test = base.extend<SubmissionFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	dynamicFormPage: async ({ page }, use) => {
		await use(new DynamicFormPage(page));
	},
});

export { expect } from '../fe.fixture';
