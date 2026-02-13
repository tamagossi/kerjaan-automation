import { AuthAPI } from "../auth.api";

export class LoginAPI extends AuthAPI {
  async loginWithValidCredentials(email: string, password: string) {
    return this.login(email, password);
  }

  async loginWithInvalidCredentials() {
    return this.login("invalid@staffinc.co", "wrongpassword");
  }

  async loginWithEmptyBody() {
    return this.login("", "");
  }
}
