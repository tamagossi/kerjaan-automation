import { expect, test } from "@/tests/fe/auth";

import loginData from "./login.data.json";
import { LoginPage } from "./login.page";

test.describe("Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should display login form", async () => {
    await loginPage.expectOnLoginPage();
    await loginPage.expectVisible(loginPage.emailInput);
    await loginPage.expectVisible(loginPage.passwordInput);
    await loginPage.expectVisible(loginPage.submitButton);
  });

  test("should login successfully with valid credentials", async () => {
    await loginPage.login(loginData.validLogin.email, loginData.validLogin.password);
    await loginPage.expectOnDashboard();
  });

  test("should show error with invalid credentials", async () => {
    await loginPage.login(loginData.invalidLogin.email, loginData.invalidLogin.password);
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
