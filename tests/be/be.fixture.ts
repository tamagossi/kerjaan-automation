import { APIRequestContext, request } from "@playwright/test";

import { expect,test as base } from "@/src/core";
import { getAuthToken } from "@/src/helpers";

type BeFixtures = {
  apiContext: APIRequestContext;
  authenticatedApiContext: APIRequestContext;
};

export const test = base.extend<BeFixtures>({
  apiContext: async ({ envConfig }, use) => {
    const ctx = await request.newContext({
      baseURL: envConfig.BE_BASE_URL,
    });
    await use(ctx);
    await ctx.dispose();
  },

  authenticatedApiContext: async ({ envConfig }, use) => {
    const token = await getAuthToken();
    const ctx = await request.newContext({
      baseURL: envConfig.BE_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect };
