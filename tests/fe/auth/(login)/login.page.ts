import { Locator } from "@playwright/test";

import { ROUTES } from "@/src/constants";

import { AuthPage } from "../auth.page";

export class LoginPage extends AuthPage {
  get emailInput(): Locator {
    return this.page.locator('[data-testid="login-email"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-testid="login-password"]');
  }

  get submitButton(): Locator {
    return this.page.locator('[data-testid="login-submit"]');
  }

  async goto(): Promise<void> {
    await this.navigate(ROUTES.LOGIN);
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.submitButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await this.expectUrl(/\/login/);
  }

  async expectOnDashboard(): Promise<void> {
    await this.expectUrl(/\/dashboard/);
  }
}
