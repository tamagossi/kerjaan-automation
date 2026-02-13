import { request } from "@playwright/test";

import { loadEnvConfig } from "@/src/config";

export async function getAuthToken(): Promise<string> {
  const env = loadEnvConfig();
  const apiContext = await request.newContext({
    baseURL: env.BE_BASE_URL,
  });

  const response = await apiContext.post(`/${env.BE_API_VERSION}/auth/login`, {
    data: {
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
    },
  });

  const body = await response.json();
  await apiContext.dispose();

  return body.data.token;
}

export async function getAuthCookie(): Promise<string> {
  const token = await getAuthToken();
  return `token=${token}`;
}
