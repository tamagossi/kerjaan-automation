import { generateEmail, generatePassword } from "@/src/helpers";

export function createValidCredentials() {
  return {
    email: generateEmail("auth"),
    password: generatePassword(),
  };
}

export function createInvalidCredentials() {
  return {
    email: "invalid@staffinc.co",
    password: "wrongpassword",
  };
}
