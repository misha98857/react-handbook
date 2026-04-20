import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { preferencesMock } = vi.hoisted(() => {
  const store = new Map<string, string>();
  return {
    preferencesMock: {
      store,
      reset: () => store.clear(),
      get: vi.fn(async ({ key }: { key: string }) => ({
        value: store.has(key) ? store.get(key)! : null,
      })),
      set: vi.fn(async ({ key, value }: { key: string; value: string }) => {
        store.set(key, value);
      }),
    },
  };
});

vi.mock('@capacitor/preferences', () => ({ Preferences: preferencesMock }));
vi.mock('@capacitor/device', () => ({
  Device: { getLanguageCode: vi.fn(async () => ({ value: 'ru' })) },
}));

import { SettingsStore, initialSettingsState } from './settings.store';

describe('SettingsStore', () => {
  let store: InstanceType<typeof SettingsStore>;

  beforeEach(() => {
    preferencesMock.reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  async function init() {
    TestBed.configureTestingModule({});
    store = TestBed.inject(SettingsStore);
    // даём отработать async onInit
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  }

  it('инициализируется значениями по умолчанию + разрешённым языком устройства, когда хранилище пусто', async () => {
    await init();
    expect(store.darkTheme()).toBe(initialSettingsState.darkTheme);
    expect(store.fontSize()).toBe(initialSettingsState.fontSize);
    expect(store.language()).toBe('ru');
  });

  it('подхватывает сохранённые настройки из Preferences при init', async () => {
    preferencesMock.store.set('settings', JSON.stringify({ darkTheme: true, fontSize: 1.5, language: 'en' }));
    await init();
    expect(store.darkTheme()).toBe(true);
    expect(store.fontSize()).toBe(1.5);
    expect(store.language()).toBe('en');
  });

  it('updateSettings патчит state и пишет JSON в Preferences', async () => {
    await init();
    store.updateSettings({ darkTheme: true, fontSize: 1.25 });
    expect(store.darkTheme()).toBe(true);
    expect(store.fontSize()).toBe(1.25);
    expect(preferencesMock.set).toHaveBeenCalledWith(expect.objectContaining({ key: 'settings' }));
    const lastCall = preferencesMock.set.mock.calls.at(-1)![0];
    const persisted = JSON.parse(lastCall.value);
    expect(persisted.darkTheme).toBe(true);
    expect(persisted.fontSize).toBe(1.25);
  });

  it('частичный updateSettings сохраняет остальные поля', async () => {
    await init();
    store.updateSettings({ showArticleProgress: false });
    expect(store.showArticleProgress()).toBe(false);
    expect(store.restoreArticleProgress()).toBe(initialSettingsState.restoreArticleProgress);
  });
});
