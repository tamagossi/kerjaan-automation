import { generateEmail, generateFullName, generatePassword } from "@/src/helpers";

export function createRegistrationData() {
  return {
    email: generateEmail("register"),
    password: generatePassword(),
    name: generateFullName(),
  };
}

export function createLoginPayload() {
  return {
    email: generateEmail("login"),
    password: generatePassword(),
  };
}
