import { expectError, expectJsonBody, expectSuccess } from "@/src/helpers";
import type { ApiResponse } from "@/src/types";
import { expect, test } from "@/tests/be/auth";

import { LoginAPI } from "./login.api";
import loginData from "./login.data.json";

test.describe("POST /auth/login", () => {
  let loginAPI: LoginAPI;

  test.beforeEach(async ({ apiContext }) => {
    loginAPI = new LoginAPI(apiContext);
  });

  test("should return 200 with valid credentials", async () => {
    const response = await loginAPI.loginWithValidCredentials(
      loginData.validCredentials.email,
      loginData.validCredentials.password,
    );

    await expectSuccess(response);
    const body = await expectJsonBody<ApiResponse<{ token: string }>>(response);
    expect(body.data.token).toBeTruthy();
  });

  test("should return 401 with invalid credentials", async () => {
    const response = await loginAPI.loginWithInvalidCredentials();
    await expectError(response, 401);
  });

  test("should return 400 with empty body", async () => {
    const response = await loginAPI.loginWithEmptyBody();
    await expectError(response, 400);
  });
});
