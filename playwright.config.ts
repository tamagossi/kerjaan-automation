import { defineConfig, devices } from "@playwright/test";

import { loadEnvConfig } from "@/src/config";

const env = loadEnvConfig();

export default defineConfig({
  retries: 0,
  reporter: [["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "fe",
      testDir: "./tests/fe",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: env.FE_BASE_URL,
        headless: env.HEADLESS === "true",
        launchOptions: {
          slowMo: Number(env.SLOW_MO) || 0,
        },
      },
    },
    {
      name: "be",
      testDir: "./tests/be",
      use: {
        baseURL: env.BE_BASE_URL,
      },
    },
  ],
});
