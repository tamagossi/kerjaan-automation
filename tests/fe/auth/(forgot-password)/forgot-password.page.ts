import { Locator } from "@playwright/test";

import { ROUTES } from "@/src/constants";

import { AuthPage } from "../auth.page";

export class ForgotPasswordPage extends AuthPage {
  get emailInput(): Locator {
    return this.page.locator('[data-testid="forgot-password-email"]');
  }

  get submitButton(): Locator {
    return this.page.locator('[data-testid="forgot-password-submit"]');
  }

  get successMessage(): Locator {
    return this.page.locator('[data-testid="forgot-password-success"]');
  }

  get backToLoginLink(): Locator {
    return this.page.locator('[data-testid="back-to-login"]');
  }

  async goto(): Promise<void> {
    await this.navigate(ROUTES.FORGOT_PASSWORD);
    await this.waitForPageLoad();
  }

  async submitForgotPassword(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.submitButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    await this.expectVisible(this.successMessage);
  }
}
