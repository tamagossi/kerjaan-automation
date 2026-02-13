import { generateEmail, generatePassword } from "@/src/helpers";

export function createLoginTestData() {
  return {
    email: generateEmail("login-api"),
    password: generatePassword(),
  };
}
