import dotenv from 'dotenv';

import type { EnvConfig } from '@/src/types';

export function loadEnvConfig(): EnvConfig {
	const testEnv = process.env.TEST_ENV || 'dev';

	dotenv.config({ path: `.env.${testEnv}` });

	return {
		BE_API_VERSION: process.env.BE_API_VERSION || 'v1',
		BE_BASE_URL: process.env.BE_BASE_URL || 'http://localhost:8080',
		FE_BASE_URL: process.env.FE_BASE_URL || 'http://localhost:3000',
		HEADLESS: process.env.HEADLESS || 'false',
		SLOW_MO: process.env.SLOW_MO || '300',

		CRED_MAIN_EMAIL: process.env.CRED_MAIN_EMAIL || '',
		CRED_MAIN_PASSWORD: process.env.CRED_MAIN_PASSWORD || '',

		PK136_BLACKLISTED_EMAIL: process.env.PK136_BLACKLISTED_EMAIL || '',
		PK136_BLACKLISTED_PASSWORD: process.env.PK136_BLACKLISTED_PASSWORD || '',
		PK136_NON_BLACKLISTED_EMAIL: process.env.PK136_NON_BLACKLISTED_EMAIL || '',
		PK136_NON_BLACKLISTED_PASSWORD: process.env.PK136_NON_BLACKLISTED_PASSWORD || '',
		PK136_NON_WHITELISTED_EMAIL: process.env.PK136_NON_WHITELISTED_EMAIL || '',
		PK136_NON_WHITELISTED_PASSWORD: process.env.PK136_NON_WHITELISTED_PASSWORD || '',
		PK136_WHITELISTED_EMAIL: process.env.PK136_WHITELISTED_EMAIL || '',
		PK136_WHITELISTED_PASSWORD: process.env.PK136_WHITELISTED_PASSWORD || '',
	};
}
