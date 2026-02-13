import { test } from '../auth.fixture';
import { LOGIN_CREDENTIALS } from './index';

test.describe('Login Feature', () => {
	test('Should login successfully', async ({ loginPage }) => {
		await loginPage.visit();
		await loginPage.verifyOnLoginPage();
		await loginPage.login(LOGIN_CREDENTIALS.EMAIL, LOGIN_CREDENTIALS.PASSWORD);
		// Verify redirection to agents page
		await loginPage.expectUrl(/.*agents/);
	});
});
