import { expectError, expectJsonBody, expectSuccess } from "@/src/helpers";
import type { ApiResponse } from "@/src/types";
import { expect, test } from "@/tests/be/auth";

import { RegisterAPI } from "./register.api";
import { createRegisterTestData } from "./register.data";
import registerData from "./register.data.json";

test.describe("POST /auth/register", () => {
  let registerAPI: RegisterAPI;

  test.beforeEach(async ({ apiContext }) => {
    registerAPI = new RegisterAPI(apiContext);
  });

  test("should return 201 with valid registration data", async () => {
    const data = createRegisterTestData();
    const response = await registerAPI.registerNewUser(data);

    await expectSuccess(response);
    const body = await expectJsonBody<ApiResponse<{ id: string }>>(response);
    expect(body.data.id).toBeTruthy();
  });

  test("should return 409 with existing email", async () => {
    const response = await registerAPI.registerWithExistingEmail(
      registerData.existingUser.email,
    );
    await expectError(response, 409);
  });

  test("should return 400 with empty body", async () => {
    const response = await registerAPI.registerWithEmptyBody();
    await expectError(response, 400);
  });
});
