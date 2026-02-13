import { faker } from "@faker-js/faker";

export function generateEmail(prefix = "test"): string {
  const timestamp = Date.now();
  return `${prefix}+${timestamp}@staffinc.co`;
}

export function generatePassword(length = 12): string {
  return faker.internet.password({ length, memorable: false });
}

export function generateFullName(): string {
  return faker.person.fullName();
}

export function generatePhoneNumber(): string {
  return faker.phone.number({ style: "international" });
}
