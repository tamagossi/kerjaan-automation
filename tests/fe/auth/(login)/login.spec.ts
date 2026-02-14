import { loadEnvConfig } from '@/src/config';

import { test } from '../auth.fixture';
import { createRandomCredentials } from './index';

const env = loadEnvConfig();

test.describe('Login feature: ', () => {
	test('TS.1: Should login successfully', async ({ loginPage }) => {
		await loginPage.visit();
		await loginPage.verifyOnLoginPage();
		await loginPage.login(env.CRED_MAIN_EMAIL, env.CRED_MAIN_PASSWORD);

		await loginPage.expectUrl(/.*agents/);
	});

	test('TS.2: Should fail to login with incorrect credentials', async ({ loginPage }) => {
		const { email, password } = createRandomCredentials();

		await loginPage.visit();
		await loginPage.verifyOnLoginPage();
		await loginPage.login(email, password);

		await loginPage.verifyOnLoginPage();
		await loginPage.verifyErrorMessageVisible();
	});
});
