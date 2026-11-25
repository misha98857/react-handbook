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

import { ReadProgressStore } from './read-progress.store';

describe('ReadProgressStore', () => {
  let store: InstanceType<typeof ReadProgressStore>;

  beforeEach(() => {
    preferencesMock.reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  async function init() {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ReadProgressStore);
    await Promise.resolve();
    await Promise.resolve();
  }

  it('инициализирует пустой объект прогресса', async () => {
    await init();
    expect(store.readProgressState()).toEqual({});
  });

  it('загружает сохранённый прогресс из Preferences', async () => {
    preferencesMock.store.set('progress', JSON.stringify({ a: 0.5, b: 1 }));
    await init();
    expect(store.readProgressState()).toEqual({ a: 0.5, b: 1 });
  });

  it('updateReadProgress мерджит новые значения', async () => {
    await init();
    store.updateReadProgress({ a: 0.3 });
    store.updateReadProgress({ b: 0.7 });
    expect(store.readProgressState()).toEqual({ a: 0.3, b: 0.7 });
  });

  it('updateReadProgress перезаписывает существующий ключ', async () => {
    await init();
    store.updateReadProgress({ a: 0.1 });
    store.updateReadProgress({ a: 0.9 });
    expect(store.readProgressState()).toEqual({ a: 0.9 });
  });

  it('persist effect пишет прогресс в Preferences после обновления', async () => {
    await init();
    store.updateReadProgress({ a: 0.5 });
    // дать effect отработать
    await new Promise(r => setTimeout(r, 0));
    expect(preferencesMock.set).toHaveBeenCalledWith(expect.objectContaining({ key: 'progress' }));
    const persisted = JSON.parse(preferencesMock.set.mock.calls.at(-1)![0].value);
    expect(persisted).toEqual({ a: 0.5 });
  });

  it('persist effect не пишет когда прогресс пустой', async () => {
    await init();
    await new Promise(r => setTimeout(r, 0));
    expect(preferencesMock.set).not.toHaveBeenCalled();
  });
});
