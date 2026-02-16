import { faker } from '@faker-js/faker';

export function generateEmail(prefix = 'test'): string {
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
	return faker.phone.number({ style: 'international' });
}

export function generateFormNameWithTimestamp(prefix = 'Tama Test Automation'): string {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const year = now.getFullYear();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');

	return `${day}:${month}:${year} ${hours}:${minutes} | ${prefix}`;
}
