import { test as base } from '@/tests/fe/submission';

import { FormListPage } from './form-list.page';

type FormListFixtures = {
	formListPage: FormListPage;
};

export const test = base.extend<FormListFixtures>({
	formListPage: async ({ page }, use) => {
		await use(new FormListPage(page));
	},
});

export { expect } from '@/tests/fe/submission';
