import { test } from '../auth.fixture';
import { createRandomCredentials, LOGIN_CREDENTIALS } from './index';

test.describe('Login feature: ', () => {
	test('TS.1: Should login successfully', async ({ loginPage }) => {
		await loginPage.visit();
		await loginPage.verifyOnLoginPage();
		await loginPage.login(LOGIN_CREDENTIALS.EMAIL, LOGIN_CREDENTIALS.PASSWORD);

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
