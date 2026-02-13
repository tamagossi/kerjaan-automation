import { Locator } from "@playwright/test";

import { BasePage } from "@/src/core";

export class AuthPage extends BasePage {
  get errorMessage(): Locator {
    return this.page.locator('[data-testid="auth-error-message"]');
  }

  get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="auth-loading"]');
  }

  async expectAuthError(message: string): Promise<void> {
    await this.expectVisible(this.errorMessage);
    await this.expectText(this.errorMessage, message);
  }
}
