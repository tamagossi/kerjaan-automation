import { faker } from '@faker-js/faker';

export const createRandomCredentials = () => {
	return {
		email: faker.internet.email(),
		password: faker.internet.password(),
	};
};
