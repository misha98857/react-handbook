import { getState, patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { LanguageService } from '../features/services/language.service';

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
  language: '',
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
    onInit: async (store, languageService = inject(LanguageService)) => {
      const settings = JSON.parse((await Preferences.get({ key: 'settings' })).value);
      const language = await languageService.getLanguage(settings?.language);
      patchState(store, state => ({ ...state, ...settings, language }));
    },
  }),
);
