import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import process from 'node:process';
import { authFile } from './tests/env';

export default defineConfig({
    testDir: './tests',
    timeout: 5 * 60_000,

    fullyParallel: false,
    workers: 1,

    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: 'html',

    use: {
        baseURL: process.env.BASE_URL,
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'setup',
            testMatch: /setup\.spec\.ts$/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: { cookies: [], origins: [] },
            },
        },
        {
            name: 'chromium',
            testIgnore: /setup\.spec\.ts$/,
            dependencies: ['setup'],
            use: {
                ...devices['Desktop Chrome'],
                storageState: authFile,
            },
        },
    ],
});