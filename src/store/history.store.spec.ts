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
      remove: vi.fn(async ({ key }: { key: string }) => {
        store.delete(key);
      }),
      clear: vi.fn(async () => {
        store.clear();
      }),
      keys: vi.fn(async () => ({ keys: Array.from(store.keys()) })),
    },
  };
});

vi.mock('@capacitor/preferences', () => ({
  Preferences: preferencesMock,
}));

import { HistoryStore } from './history.store';

describe('HistoryStore', () => {
  let store: InstanceType<typeof HistoryStore>;

  beforeEach(() => {
    preferencesMock.reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  function init() {
    TestBed.configureTestingModule({});
    store = TestBed.inject(HistoryStore);
  }

  it('инициализирует пустые значения если в Preferences ничего нет', async () => {
    init();
    await Promise.resolve();
    await Promise.resolve();
    expect(store.latestPage()).toBe(null);
    expect(store.appStateRestored()).toBe(false);
  });

  it('загружает latestPage из Preferences при init', async () => {
    preferencesMock.store.set('latestPage', '"react/intro"');
    init();
    await Promise.resolve();
    await Promise.resolve();
    expect(store.latestPage()).toBe('"react/intro"');
  });

  it('updateLatestPage обновляет состояние и пишет в Preferences', () => {
    init();
    store.updateLatestPage('react/hooks');
    expect(store.latestPage()).toBe('react/hooks');
    expect(preferencesMock.set).toHaveBeenCalledWith({
      key: 'latestPage',
      value: JSON.stringify('react/hooks'),
    });
  });

  it('updateAppStateRestored переключает флаг', () => {
    init();
    expect(store.appStateRestored()).toBe(false);
    store.updateAppStateRestored(true);
    expect(store.appStateRestored()).toBe(true);
  });
});
