import { test as setup, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { authFile, requiredEnv } from './env';

setup('authenticate and save session', async ({ page }) => {
  setup.setTimeout(240_000);
  const baseUrl = requiredEnv('BASE_URL');
  const email = requiredEnv('EMAIL');
  const password = requiredEnv('PASSWORD');
  const successUrl = requiredEnv('SUCCESS_LOGIN');
  const dashboardUrl = requiredEnv('DASHBOARD');

  await page.goto(baseUrl);
  await page.getByTestId('main-login-button').click();
  const emailField = page.getByRole('textbox', { name: 'Email or phone' });
  await emailField.fill(email);
  await emailField.press('Enter');

  const passwordField = page.getByLabel('Enter your password', { exact: true });
  await expect(passwordField).toBeVisible({ timeout: 180_000 });
  await passwordField.fill(password);
  await passwordField.press('Enter');

  // Wait for the real redirect; goto() here could interrupt authentication.
  await page.waitForURL(successUrl, { timeout: 60_000 });

  // Preserves the second app-login click from your supplied flow.
  // If sign-in redirects straight to the dashboard, remove this click and
  // set SUCCESS_LOGIN to the dashboard URL.
  await page.waitForURL(dashboardUrl, { timeout: 120_000 });
  await expect(page.getByRole('link').filter({hasText: 'Project Settings' })).toBeVisible();

  await mkdir(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile, indexedDB: true });
});
