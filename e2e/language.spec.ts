import { expect, test } from '@playwright/test';

async function setLanguage(page: import('@playwright/test').Page, name: 'Russian' | 'English'): Promise<void> {
  await page.goto('/languages');
  await page.locator('app-card').filter({ hasText: name }).first().click();
  // App stays on /languages after selection; the selected card turns primary.
  await expect(page.locator('app-card').filter({ hasText: name }).first().locator('ion-card-title')).toHaveClass(
    /ion-color-primary/,
  );
}

test.describe('languages & fallback banner', () => {
  test('selecting a language highlights the card', async ({ page }) => {
    await setLanguage(page, 'Russian');
  });

  test('fallback banner appears on untranslated article', async ({ page }) => {
    await setLanguage(page, 'Russian');
    await page.goto('/react/learn-react-compiler-introduction');
    await expect(page.locator('.translation-banner')).toBeVisible();
  });

  test('no banner on a translated article', async ({ page }) => {
    await setLanguage(page, 'Russian');
    await page.goto('/react/learn');
    await expect(page.locator('app-article-render')).toBeVisible();
    await expect(page.locator('.translation-banner')).toHaveCount(0);
  });

  test.afterEach(async ({ page }) => {
    // Reset to English so downstream tests don't start in Russian.
    await setLanguage(page, 'English');
  });
});
