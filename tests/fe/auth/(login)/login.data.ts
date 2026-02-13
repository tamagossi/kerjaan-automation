import { generateEmail, generatePassword } from "@/src/helpers";

export function createLoginData() {
  return {
    email: generateEmail("login"),
    password: generatePassword(),
  };
}

export function createEmptyLoginData() {
  return {
    email: "",
    password: "",
  };
}
