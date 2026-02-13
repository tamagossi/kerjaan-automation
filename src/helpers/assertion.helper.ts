import { APIResponse, expect } from "@playwright/test";

export async function expectStatus(response: APIResponse, status: number): Promise<void> {
  expect(response.status()).toBe(status);
}

export async function expectJsonBody<T>(response: APIResponse): Promise<T> {
  expect(response.headers()["content-type"]).toContain("application/json");
  return (await response.json()) as T;
}

export async function expectSuccess(response: APIResponse): Promise<void> {
  expect(response.ok()).toBeTruthy();
}

export async function expectError(response: APIResponse, status: number): Promise<void> {
  expect(response.status()).toBe(status);
  expect(response.ok()).toBeFalsy();
}
