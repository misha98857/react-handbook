import { expect, test } from '@playwright/test';
import { expandFirstGroup, gotoHome } from './helpers';

test.describe('home', () => {
  test('loads article groups', async ({ page }) => {
    await gotoHome(page);
    const groups = page.locator('ion-accordion');
    await expect(groups.first()).toBeVisible();
    expect(await groups.count()).toBeGreaterThan(2);
  });

  test('expands a group and reveals articles', async ({ page }) => {
    await gotoHome(page);
    await expandFirstGroup(page);
    const items = page.locator('app-article-list-item ion-item');
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('has toolbar buttons for search and languages', async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator('ion-button[routerlink="/search"]').first()).toBeVisible();
    await expect(page.locator('ion-button[routerlink="/languages"]').first()).toBeVisible();
  });
});
