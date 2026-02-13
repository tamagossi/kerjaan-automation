import { AuthAPI } from "../auth.api";

export class RegisterAPI extends AuthAPI {
  async registerNewUser(data: { email: string; password: string; name: string }) {
    return this.register(data);
  }

  async registerWithExistingEmail(email: string) {
    return this.register({
      email,
      password: "password123",
      name: "Duplicate User",
    });
  }

  async registerWithEmptyBody() {
    return this.register({ email: "", password: "", name: "" });
  }
}
