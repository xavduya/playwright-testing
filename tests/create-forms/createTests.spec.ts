import { test, expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { requiredEnv } from '../env';
import {
    SettingsForm,
    SectionForm,
    BuildingForm,
    ProjectForm,
    ClassificationForm,
    ContractForm,
} from '../pages/sectionForm';

type SettingsCase = {
    kind: string;
    tab: string;
    newButton: string;
    Form: new (page: Page) => SettingsForm;
};

const settingsCases: SettingsCase[] = [
    {
        kind: 'section',
        tab: 'Section',
        newButton: 'New Section',
        Form: SectionForm,
    },
    {
        kind: 'building',
        tab: 'Building Type',
        newButton: 'New Building Type',
        Form: BuildingForm,
    },
    {
        kind: 'project',
        tab: 'Project Type',
        newButton: 'New Type',
        Form: ProjectForm,
    },
    {
        kind: 'classification',
        tab: 'Classification',
        newButton: 'New Classification',
        Form: ClassificationForm,
    },
    {
        kind: 'contract',
        tab: 'Contract Types',
        newButton: 'New Contract Type',
        Form: ContractForm,
    },
];

const numtest = 2; //set how many tests to create

for (const settings of settingsCases) {
    for (let i = 0; i < numtest; i++) {
        test(
        `project settings: create ${settings.kind} entry ${i + 1}`,
        async ({ page }) => {
            test.setTimeout(90_000);

            await page.goto(requiredEnv('DASHBOARD'));

            await page.getByRole('link')
                .filter({ hasText: 'Project Settings' })
                .click();

            await page.getByRole('tab', {
                name: settings.tab,
                exact: true,
            }).click();

            const panel = page.getByRole('tabpanel', {
                name: settings.tab,
                exact: true,
            });

            const form = new settings.Form(page);
            const suffix = faker.string.alphanumeric(8);
            const code = `Test ${settings.kind} code ${suffix}`;

            await panel.getByRole('button', {
                name: settings.newButton,
                exact: true,
            }).click();

            await form.fill({
                code,
                name: `Test ${settings.kind} name ${suffix}`,
                category: `Test ${settings.kind} category ${suffix}`,
                description: `Test ${settings.kind} description ${faker.lorem.sentence()}`,
            });

            await page.getByRole('button', {
                name: 'Save',
                exact: true,
            }).click();

            await expect (form.codeField).toBeHidden({
                timeout: 60_000,
            });

            await expect(
                panel.getByRole('cell', {
                    name: code,
                    exact: true,
                }),
            ).toBeVisible({ timeout: 30_000 });
            },
        );
    }
}