import { expect, test } from '@playwright/test';

/**
 * Read-progress is persisted through Capacitor Preferences, which on web
 * falls back to `localStorage` under the `CapacitorStorage.<key>` prefix.
 * We exercise both the UI badge rendering (by seeding storage) and the
 * real scroll-based update path.
 */

test.describe('read progress', () => {
  test('badge reflects persisted progress after reload', async ({ page, context }) => {
    // Seed progress for the Quick Start article (`learn`) at 50%.
    await context.addInitScript(() => {
      window.localStorage.setItem('CapacitorStorage.progress', JSON.stringify({ learn: 50 }));
    });
    await page.goto('/react');
    // Expand the first group ("Learn React") and find the "Quick Start" row.
    const firstGroup = page.locator('ion-accordion').first();
    await firstGroup.locator('ion-item[slot="header"]').click();
    const learnItem = firstGroup.locator('app-article-list-item ion-item').filter({ hasText: 'Quick Start' }).first();
    await expect(learnItem.locator('ion-badge')).toHaveText('50%');
  });

  test('0% badge renders in light color; 100% in success color', async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('CapacitorStorage.progress', JSON.stringify({ learn: 100, 'learn-installation': 0 }));
    });
    await page.goto('/react');
    const firstGroup = page.locator('ion-accordion').first();
    await firstGroup.locator('ion-item[slot="header"]').click();

    const done = firstGroup
      .locator('app-article-list-item ion-item')
      .filter({ hasText: 'Quick Start' })
      .locator('ion-badge');
    await expect(done).toHaveAttribute('color', 'success');
    await expect(done).toHaveText('100%');

    const untouched = firstGroup
      .locator('app-article-list-item ion-item')
      .filter({ hasText: 'Installation' })
      .first()
      .locator('ion-badge');
    await expect(untouched).toHaveAttribute('color', 'light');
  });

  test('scrolling an article updates the progress store', async ({ page }) => {
    // Clear any seeded progress.
    await page.addInitScript(() => {
      window.localStorage.removeItem('CapacitorStorage.progress');
    });
    await page.goto('/react/learn');
    await page.locator('app-article-render').waitFor();

    // The inner `ion-content` (inside app-article-render) is what fires
    // `ionScrollEnd`; its handler reads `event.target.shadowRoot.children[1]`
    // to compute progress from the shadow scroll container.
    await page.evaluate(async () => {
      const content = document.querySelector('app-article-render ion-content') as HTMLElement & {
        getScrollElement: () => Promise<HTMLElement>;
      };
      const scrollEl = await content.getScrollElement();
      // Force a scrollable state and pretend we've scrolled halfway.
      Object.defineProperty(scrollEl, 'scrollHeight', { configurable: true, value: 2000 });
      Object.defineProperty(scrollEl, 'offsetHeight', { configurable: true, value: 1000 });
      Object.defineProperty(scrollEl, 'scrollTop', { configurable: true, value: 500 });
      content.dispatchEvent(new CustomEvent('ionScrollEnd', { bubbles: true, detail: {} }));
    });

    // Give the effect + preferences round-trip time to settle.
    await expect
      .poll(
        async () =>
          await page.evaluate(() => {
            const raw = window.localStorage.getItem('CapacitorStorage.progress');
            if (!raw) return 0;
            const parsed = JSON.parse(raw) as Record<string, number>;
            return parsed['learn'] ?? 0;
          }),
        { timeout: 5_000 },
      )
      .toBeGreaterThan(0);
  });
});
