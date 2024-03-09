import { getState, patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { DestroyRef, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';

export interface SettingsState {
  language: string;
  showNavigationButtons: boolean;
  darkTheme: boolean;
  fontSize: number;
  showArticleProgress: boolean;
  restoreArticleProgress: boolean;
  restoreAppState: boolean;
}

export const initialSettingsState: SettingsState = {
  language: 'en',
  showNavigationButtons: true,
  darkTheme: false,
  fontSize: 1.0,
  showArticleProgress: true,
  restoreArticleProgress: true,
  restoreAppState: true,
};

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialSettingsState),
  withMethods(store => ({
    updateSettings: (settings: Partial<SettingsState>) => {
      patchState(store, state => ({ ...state, ...settings }));
      void Preferences.set({ key: 'settings', value: JSON.stringify(getState(store)) });
    },
  })),
  withHooks({
    onInit: (store, destroyRef = inject(DestroyRef)) => {
      from(Preferences.get({ key: 'settings' }))
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(({ value }) => {
          patchState(store, state => ({ ...state, ...JSON.parse(value) }));
        });
    },
  }),
);
