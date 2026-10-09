import { expect, type Page } from '@playwright/test';

type FormFields = {
    code: string;
    name: string;
    description: string;
    category?: string;
    building?: string;
};

export class SettingsForm {
    constructor(
        protected readonly page: Page,
        private readonly labels: FormFields,
    ) {}

    // Used by the test to check that the form closed after Save.
    get codeField() {
        return this.page.getByRole('textbox', {
            name: this.labels.code,
            exact: true,
        });
    }

    async fill(values: FormFields): Promise<void> {
        // Each const identifies a different textbox.
        const codeField = this.codeField;

        const nameField = this.page.getByRole('textbox', {
            name: this.labels.name,
            exact: true,
        });

        const descriptionField = this.page.getByRole('textbox', {
            name: this.labels.description,
            exact: true,
        });

        await codeField.fill(values.code);
        await nameField.fill(values.name);

        if (
            this.labels.category !== undefined &&
            values.category !== undefined
        ) {
            const categoryField = this.page.getByRole('textbox', {
                name: this.labels.category,
                exact: true,
            });

            await categoryField.fill(values.category);
            await expect(categoryField).toHaveValue(values.category);
        }

        if (this.labels.building !== undefined) {
            const buildingField = this.page.getByRole('textbox', {
                name: this.labels.building,
                exact: true,
            });
            //instead of writing, building types are chosen according to 'listitem'
            await buildingField.click();

            const items = this.page
            .getByRole('listitem')
            .filter({ visible: true});

            //check if there are existing building types
            await expect(items.first()).toBeVisible();

            //identify how many bulding types then randomize choosing
            const count = await items.count();
            const randomIndex = Math.floor(Math.random() * count);

            await items.nth(randomIndex).click();
            await this.page.getByRole('dialog', {
                name: 'Create Classification Close'
            }).click();
        }

        await descriptionField.fill(values.description);

        await expect(codeField).toHaveValue(values.code);
        await expect(nameField).toHaveValue(values.name);
        await expect(descriptionField).toHaveValue(values.description);
    }
}

export class SectionForm extends SettingsForm {
    constructor(page: Page) {
        super(page, {
            code: 'Section Code',
            name: 'Section Name',
            category: 'Category',
            description: 'Section Description',
        });
    }
}

export class BuildingForm extends SettingsForm {
    constructor(page: Page) {
        super(page, {
            code: 'Building Type Code',
            name: 'Building Type Name',
            description: 'Building Type Description',
        });
    }
}

export class ProjectForm extends SettingsForm {
    constructor(page: Page) {
        super(page, {
            code: 'Type Code',
            name: 'Type Name',
            description: 'Type Description',
        });
    }
}

export class ClassificationForm extends SettingsForm {
    constructor(page: Page) {
        super(page, {
            code: 'Classification Code',
            name: 'Classification Name',
            building: 'Building Type',
            description: 'Classification Description',
        });
    }
}

export class ContractForm extends SettingsForm {
    constructor(page: Page) {
        super(page, {
            code: 'Contract Type Code',
            name: 'Contract Type Name',
            description: 'Contract Type Description',
        });
    }
}