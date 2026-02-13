import { APIRequestContext, APIResponse } from "@playwright/test";

import { loadEnvConfig } from "@/src/config";

export abstract class BaseAPI {
  protected readonly apiVersion: string;

  constructor(protected readonly request: APIRequestContext) {
    this.apiVersion = loadEnvConfig().BE_API_VERSION;
  }

  protected endpoint(path: string): string {
    return `/${this.apiVersion}${path}`;
  }

  async get(path: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.get(this.endpoint(path), options);
  }

  async post(
    path: string,
    data?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    return this.request.post(this.endpoint(path), { data, ...options });
  }

  async put(
    path: string,
    data?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    return this.request.put(this.endpoint(path), { data, ...options });
  }

  async patch(
    path: string,
    data?: unknown,
    options?: { headers?: Record<string, string> },
  ): Promise<APIResponse> {
    return this.request.patch(this.endpoint(path), { data, ...options });
  }

  async delete(path: string, options?: { headers?: Record<string, string> }): Promise<APIResponse> {
    return this.request.delete(this.endpoint(path), options);
  }

  async parseJson<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }
}
