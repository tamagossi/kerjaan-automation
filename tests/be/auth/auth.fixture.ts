import { expect,test as base } from "@/tests/be";

import { AuthAPI } from "./auth.api";

type AuthFixtures = {
  authAPI: AuthAPI;
};

export const test = base.extend<AuthFixtures>({
  authAPI: async ({ apiContext }, use) => {
    const authAPI = new AuthAPI(apiContext);
    await use(authAPI);
  },
});

export { expect };
