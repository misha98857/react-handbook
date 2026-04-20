import { expect, test } from '@playwright/test';
import { expandFirstGroup, gotoHome } from './helpers';

test.describe('article', () => {
  test('opens first article and renders content', async ({ page }) => {
    await gotoHome(page);
    await expandFirstGroup(page);
    const firstItem = page.locator('app-article-list-item ion-item').first();
    await firstItem.click();
    await expect(page).toHaveURL(/\/react\/[\w-]+$/);
    await expect(page.locator('app-article-render')).toBeVisible();
  });

  test('navigates directly to a known article', async ({ page }) => {
    await page.goto('/react/learn');
    await expect(page.locator('app-article-render')).toBeVisible();
    await expect(page.locator('app-article-render h2').first()).toBeVisible();
  });

  test('back button returns to the list', async ({ page }) => {
    await page.goto('/react/learn');
    await page.locator('app-article-render').waitFor();
    await page.locator('ion-back-button').first().click();
    await expect(page).toHaveURL(/\/react\/?$/);
  });

  test('font-size buttons update inline font-size', async ({ page }) => {
    await page.goto('/react/learn');
    const render = page.locator('app-article-render');
    await render.waitFor();
    const initial = await render.evaluate(el => (el as HTMLElement).style.fontSize);
    await page.locator('ion-button:has(ion-icon[name="add-outline"])').click();
    await expect.poll(async () => render.evaluate(el => (el as HTMLElement).style.fontSize)).not.toBe(initial);
  });
});
