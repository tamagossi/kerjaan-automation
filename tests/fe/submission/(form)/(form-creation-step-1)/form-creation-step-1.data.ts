import { faker } from '@faker-js/faker';

import { generateFormNameWithTimestamp } from '@/src/helpers';

export const createBasicInformationData = () => {
	return {
		formName: generateFormNameWithTimestamp(),
		formDescription: faker.lorem.sentence({ min: 10, max: 20 }),
		trainingTitle: faker.lorem.words({ min: 3, max: 5 }),
		trainingDescription: faker.lorem.paragraph(),
		trainingVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
	};
};

export const createLongText = (maxLength: number) => {
	return faker.lorem.sentence({ min: maxLength, max: maxLength }).substring(0, maxLength);
};
