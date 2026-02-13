import { test as base } from "@playwright/test";

import { loadEnvConfig } from "@/src/config";
import type { EnvConfig } from "@/src/types";

type BaseFixtures = {
  envConfig: EnvConfig;
};

export const test = base.extend<BaseFixtures>({
  envConfig: async ({}, use) => {
    const config = loadEnvConfig();
    await use(config);
  },
});

export { expect } from "@playwright/test";
