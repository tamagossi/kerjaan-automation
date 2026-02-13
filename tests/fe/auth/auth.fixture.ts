import { expect,test as base } from "@/tests/fe";

import { AuthPage } from "./auth.page";

type AuthFixtures = {
  authPage: AuthPage;
};

export const test = base.extend<AuthFixtures>({
  authPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },
});

export { expect };
