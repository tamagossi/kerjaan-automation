import { ENDPOINTS } from "@/src/constants";
import { BaseAPI } from "@/src/core";

export class AuthAPI extends BaseAPI {
  async login(email: string, password: string) {
    return this.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  }

  async register(data: { email: string; password: string; name: string }) {
    return this.post(ENDPOINTS.AUTH.REGISTER, data);
  }

  async logout(token: string) {
    return this.post(ENDPOINTS.AUTH.LOGOUT, undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getMe(token: string) {
    return this.get(ENDPOINTS.AUTH.ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
