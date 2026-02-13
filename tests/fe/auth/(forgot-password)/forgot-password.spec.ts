import { expect, test } from "@/tests/fe/auth";

import forgotPasswordData from "./forgot-password.data.json";
import { ForgotPasswordPage } from "./forgot-password.page";

test.describe("Forgot Password", () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
  });

  test("should display forgot password form", async () => {
    await forgotPasswordPage.expectVisible(forgotPasswordPage.emailInput);
    await forgotPasswordPage.expectVisible(forgotPasswordPage.submitButton);
  });

  test("should send reset email for registered user", async () => {
    await forgotPasswordPage.submitForgotPassword(forgotPasswordData.registeredEmail);
    await forgotPasswordPage.expectSuccessMessage();
  });

  test("should show error for unregistered email", async () => {
    await forgotPasswordPage.submitForgotPassword(forgotPasswordData.unregisteredEmail);
    await expect(forgotPasswordPage.errorMessage).toBeVisible();
  });
});
