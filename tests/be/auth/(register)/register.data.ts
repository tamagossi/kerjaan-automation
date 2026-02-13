import { generateEmail, generateFullName, generatePassword } from "@/src/helpers";

export function createRegisterTestData() {
  return {
    email: generateEmail("register-api"),
    password: generatePassword(),
    name: generateFullName(),
  };
}
