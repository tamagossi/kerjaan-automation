import { generateEmail } from "@/src/helpers";

export function createForgotPasswordData() {
  return {
    email: generateEmail("forgot"),
  };
}
