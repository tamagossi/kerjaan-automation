import dotenv from "dotenv";

import type { EnvConfig } from "@/src/types";

export function loadEnvConfig(): EnvConfig {
  const testEnv = process.env.TEST_ENV || "dev";

  dotenv.config({ path: `.env.${testEnv}` });

  return {
    FE_BASE_URL: process.env.FE_BASE_URL || "http://localhost:3000",
    BE_BASE_URL: process.env.BE_BASE_URL || "http://localhost:8080",
    BE_API_VERSION: process.env.BE_API_VERSION || "v1",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
    SLOW_MO: process.env.SLOW_MO || "300",
    HEADLESS: process.env.HEADLESS || "false",
  };
}
