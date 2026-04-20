import { expect, test } from '@playwright/test';

test.describe('settings menu', () => {
  test('opens side menu and toggles dark theme', async ({ page }) => {
    await page.goto('/react');
    await page.locator('ion-menu-button').first().click();
    const menu = page.locator('ion-menu');
    await expect(menu).toBeVisible();

    const darkToggle = menu.locator('ion-item').filter({ hasText: /dark/i }).locator('ion-toggle');
    await darkToggle.click();

    await expect.poll(async () => page.locator('ion-app').getAttribute('class')).toMatch(/dark/);

    // Toggle back to clean state for other tests.
    await darkToggle.click();
    await expect.poll(async () => page.locator('ion-app').getAttribute('class')).not.toMatch(/dark/);
  });

  test('can toggle progress visibility', async ({ page }) => {
    await page.goto('/react');
    await page.locator('ion-menu-button').first().click();
    const menu = page.locator('ion-menu');
    await expect(menu).toBeVisible();
    const toggle = menu
      .locator('ion-item')
      .filter({ hasText: /progress/i })
      .first()
      .locator('ion-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    await toggle.click();
  });
});
