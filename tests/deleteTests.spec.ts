import { test, expect } from '@playwright/test';
import { openProjectSettings, waitForSettingsLoaded } from './project-settings';

//if only one tab to delete
//const tabsToDelete: string[] =['Section'];

//if multiple, comment out the other one and uncomment this
const tabsToDelete: string[] = ['Building Type','Project Type','Classification', 'Contract Types'];

/*Sections available
Section,
Building Type,
Project Type,
Classification,
Contract Types
*/

test('project settings: delete entries from selected tab/s', async ({ page }) => {
  test.setTimeout(300_000);
  await openProjectSettings(page);

  for(const tabName of tabsToDelete) {
    await test.step(`Delete Test entries from ${tabName}`, async () => {
      await page.getByRole('tab', {
        name: tabName,
        exact: true,
      }).click();
    
    const panel = page.getByRole('tabpanel', {
      name: tabName,
      exact: true,
    });

    await expect(panel).toBeVisible();
    await waitForSettingsLoaded(page, tabName);

    const matchingCells = panel.getByRole('cell', {
      name: /Test/i,
    });

    while(true) {
      await waitForSettingsLoaded(page, tabName);

      if(await matchingCells.count() === 0) {
        break;
      }

      const rows = panel.getByRole('row');
      const previousRows = await rows.allTextContents();

      await matchingCells.first().click();

      await page.getByRole('button', {
        name: 'Delete',
        exact: true,
      }).click();

      await page.getByRole('button', {
        name: 'Delete',
        exact: true,
      }).click();


      await expect.poll (
        () => rows.allTextContents(),
        {
          message: `Waiting for ${tabName} to update after deleting`,
          timeout: 30_000,
        },
      ).not.toEqual(previousRows);
    }

      await expect(matchingCells).toHaveCount(0);
    });
  }
});
