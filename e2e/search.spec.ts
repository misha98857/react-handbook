import { expect, test } from '@playwright/test';

test.describe('search', () => {
  test('filters articles by query', async ({ page }) => {
    await page.goto('/search');
    await page.locator('ion-searchbar input').fill('useState');
    // Give the store debounce time.
    await page.waitForTimeout(400);
    const groups = page.locator('ion-accordion');
    await expect(groups.first()).toBeVisible({ timeout: 5_000 });
  });

  test('opens an article from search results', async ({ page }) => {
    await page.goto('/search');
    await page.locator('ion-searchbar input').fill('Quick Start');
    await page.waitForTimeout(400);
    const firstGroup = page.locator('ion-accordion').first();
    await firstGroup.locator('ion-item[slot="header"]').click();
    const firstItem = firstGroup.locator('app-article-list-item ion-item').first();
    await firstItem.click();
    await expect(page).toHaveURL(/\/react\/[\w-]+/);
  });
});
