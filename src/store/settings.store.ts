import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

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
    },
  })),
);
