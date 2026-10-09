import { expect, type Page } from '@playwright/test';
import { requiredEnv } from './env';

export async function waitForSettingsLoaded(page: Page, tabName: string): Promise<void> {
    await expect(page).toHaveURL(
        requiredEnv('PROJECT_SETTINGS_URL'),
        { timeout: 30_000 },
    );

    const panel = page.getByRole('tabpanel', {
        name: tabName,
        exact: true,
    });

    await expect(panel).toBeVisible();
    await expect(panel.getByRole('table')).toBeVisible();
}

export async function openProjectSettings(page: Page): Promise<void> {
    await page.goto(requiredEnv('DASHBOARD'));
    await page.getByRole('link').filter({ hasText: 'Project Settings' }).click();
    await expect(page).toHaveURL(
        requiredEnv('PROJECT_SETTINGS_URL'),
        { timeout: 30_000 },
    );

    await expect(
        page.getByRole('tab', { name: 'Section', exact: true}),
    ).toBeVisible();
}
