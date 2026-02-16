import { test as base } from '@/tests/fe/submission';

import { FormCreationStep1Page } from './form-creation-step-1.page';

type FormCreationStep1Fixtures = {
	formCreationStep1Page: FormCreationStep1Page;
};

export const test = base.extend<FormCreationStep1Fixtures>({
	formCreationStep1Page: async ({ page }, use) => {
		await use(new FormCreationStep1Page(page));
	},
});

export { expect } from '@/tests/fe/submission';
