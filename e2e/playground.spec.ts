import { expect, test } from '@playwright/test';

/**
 * Playground / Sandpack examples.
 *
 * `learn-001` — plain JSX, no CSS file.
 * `learn-002` — uses `/styles1.css` with a `.avatar { border-radius: 50% }`
 *   rule that is NOT explicitly imported from App.js. It must still apply
 *   (runner auto-injects bundled CSS, mirroring Sandpack).
 */

async function openPlaygroundFromArticle(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/react/learn');
  await page.locator('app-article-render').waitFor();
  const placeholder = page.locator('.sandpack-placeholder').first();
  await placeholder.scrollIntoViewIfNeeded();
  await placeholder.click();
  await expect(page.locator('app-playground-modal')).toBeVisible();
}

test.describe('playground', () => {
  test('opens modal when clicking a sandpack placeholder', async ({ page }) => {
    await openPlaygroundFromArticle(page);
    await expect(page.locator('app-playground-modal iframe')).toBeVisible();
  });

  test('renders example output inside sandboxed iframe', async ({ page }) => {
    await openPlaygroundFromArticle(page);
    const frame = page.frameLocator('app-playground-modal iframe');
    // Wait for any rendered element in the #root container.
    await expect(frame.locator('#root *').first()).toBeVisible({ timeout: 15_000 });
  });

  test('bundled CSS file is auto-applied even without explicit import', async ({ page }) => {
    // Navigate straight to an article that embeds the "avatar" example (learn-002).
    await page.goto('/react/learn');
    await page.locator('app-article-render').waitFor();
    // learn-002 is the second placeholder on the Quick Start page.
    const placeholders = page.locator('.sandpack-placeholder');
    const count = await placeholders.count();
    expect(count).toBeGreaterThanOrEqual(2);
    await placeholders.nth(1).scrollIntoViewIfNeeded();
    await placeholders.nth(1).click();
    await expect(page.locator('app-playground-modal')).toBeVisible();

    const frame = page.frameLocator('app-playground-modal iframe');
    const avatar = frame.locator('#root img.avatar');
    await expect(avatar).toBeVisible({ timeout: 15_000 });
    // Rule `.avatar { border-radius: 50% }` from styles1.css must be active.
    const radius = await avatar.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).not.toBe('0px');
    expect(radius).not.toBe('');
  });

  test('switches between files via segment tabs', async ({ page }) => {
    // Pick an example that has multiple files: learn-002 ships App.js + styles1.css.
    await page.goto('/react/learn');
    await page.locator('app-article-render').waitFor();
    await page.locator('.sandpack-placeholder').nth(1).click();
    await expect(page.locator('app-playground-modal')).toBeVisible();

    const segments = page.locator('app-playground-modal ion-segment-button');
    const segmentCount = await segments.count();
    expect(segmentCount).toBeGreaterThanOrEqual(2);
    await segments.nth(1).click();
    // Source view should update; assert it's not empty.
    const source = page.locator('app-playground-modal .playground-code__source');
    await expect(source).not.toBeEmpty();
  });

  test('close button dismisses the modal', async ({ page }) => {
    await openPlaygroundFromArticle(page);
    await page.locator('app-playground-modal ion-button:has(ion-icon[name="close-outline"])').click();
    await expect(page.locator('app-playground-modal')).toHaveCount(0);
  });
});
