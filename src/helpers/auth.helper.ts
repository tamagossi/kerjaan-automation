import fs from 'node:fs';
import path from 'node:path';

import { request } from '@playwright/test';

import { loadEnvConfig } from '@/src/config';

const AUTH_DIR = path.resolve(process.cwd(), '.auth');
const TOKEN_PATH = path.join(AUTH_DIR, 'token.json');
const STATE_PATH = path.join(AUTH_DIR, 'state.json');

export async function getAuthToken(): Promise<string> {
	if (!fs.existsSync(AUTH_DIR)) {
		fs.mkdirSync(AUTH_DIR, { recursive: true });
	}

	if (fs.existsSync(TOKEN_PATH)) {
		const stats = fs.statSync(TOKEN_PATH);
		const now = new Date().getTime();
		const mtime = new Date(stats.mtime).getTime();
		if (now - mtime < 24 * 60 * 60 * 1000) {
			const data = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
			return data.token;
		}
	}

	const env = loadEnvConfig();
	const apiContext = await request.newContext({ baseURL: env.BE_BASE_URL });
	const response = await apiContext.post(`/${env.BE_API_VERSION}/auth/login`, {
		data: { email: env.CRED_MAIN_EMAIL, password: env.CRED_MAIN_PASSWORD },
	});

	if (!response.ok()) {
		throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
	}

	const body = await response.json();
	await apiContext.dispose();
	const token = body.data.token;

	fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token }));
	return token;
}

export async function getStorageState(url: string): Promise<string> {
	if (fs.existsSync(STATE_PATH)) {
		const stats = fs.statSync(STATE_PATH);
		const now = new Date().getTime();
		const mtime = new Date(stats.mtime).getTime();
		if (now - mtime < 24 * 60 * 60 * 1000) {
			return STATE_PATH;
		}
	}
	const token = await getAuthToken();
	const urlObj = new URL(url);
	const state = {
		cookies: [
			{
				name: 'token',
				value: token,
				domain: urlObj.hostname,
				path: '/',
				expires: -1,
				httpOnly: false,
				secure: false,
				sameSite: 'Lax',
			},
		],
		origins: [],
	};
	fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
	return STATE_PATH;
}
