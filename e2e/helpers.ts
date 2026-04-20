import { expect, Page } from '@playwright/test';

/**
 * Common helpers for Ionic + Angular navigation.
 */

export async function gotoHome(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveURL(/\/react\/?$/);
  // Wait for the first accordion group to render.
  await page.locator('ion-accordion').first().waitFor({ state: 'visible' });
}

export async function expandFirstGroup(page: Page): Promise<void> {
  const first = page.locator('ion-accordion').first();
  await first.locator('ion-item[slot="header"]').click();
  // Wait for at least one inner article item.
  await first.locator('app-article-list-item ion-item').first().waitFor({ state: 'visible' });
}

export async function openMenu(page: Page): Promise<void> {
  await page.locator('ion-menu-button').first().click();
  // Ionic renders menu animation — wait for visible state via aria-hidden=false.
  const menu = page.locator('ion-menu');
  await expect(menu).toBeVisible();
}

export async function closeMenu(page: Page): Promise<void> {
  // Tap the backdrop to close.
  await page.keyboard.press('Escape');
}

export async function setLanguage(page: Page, abbr: 'en' | 'ru'): Promise<void> {
  await page.goto('/languages');
  await page
    .locator(`app-card`)
    .filter({ hasText: abbrToName(abbr) })
    .first()
    .click();
  // After selection the user is returned to /react.
  await expect(page).toHaveURL(/\/react\/?$/);
}

function abbrToName(abbr: 'en' | 'ru'): string {
  return abbr === 'en' ? 'English' : 'Russian';
}
