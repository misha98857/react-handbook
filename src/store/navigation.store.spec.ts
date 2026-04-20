import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { NavigationStore } from './navigation.store';

describe('NavigationStore', () => {
  let store: InstanceType<typeof NavigationStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(NavigationStore);
  });

  it('инициализируется значениями по умолчанию', () => {
    expect(store.isSearch()).toBe(false);
    expect(store.isProgress()).toBe(false);
    expect(store.isInternalLink()).toBe(false);
  });

  it('updateNavigationState частично обновляет состояние', () => {
    store.updateNavigationState({ isSearch: true });
    expect(store.isSearch()).toBe(true);
    expect(store.isProgress()).toBe(false);
  });

  it('сохраняет остальные поля при последовательных обновлениях', () => {
    store.updateNavigationState({ isSearch: true });
    store.updateNavigationState({ isProgress: true });
    expect(store.isSearch()).toBe(true);
    expect(store.isProgress()).toBe(true);
    expect(store.isInternalLink()).toBe(false);
  });

  it('может обновить все поля одновременно', () => {
    store.updateNavigationState({ isSearch: true, isProgress: true, isInternalLink: true });
    expect(store.isSearch()).toBe(true);
    expect(store.isProgress()).toBe(true);
    expect(store.isInternalLink()).toBe(true);
  });
});
