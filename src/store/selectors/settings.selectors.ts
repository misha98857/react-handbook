import { createSelector } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { SettingsState } from '../state/settings.state';

export const selectSettingsState = (state: AppState): SettingsState => state.settings;

export const selectAppTheme = createSelector(
  selectSettingsState,
  (settingsState: SettingsState) => settingsState.darkTheme,
);

export const selectLanguage = createSelector(
  selectSettingsState,
  (settingsState: SettingsState) => settingsState.language,
);

export const selectNavButtons = createSelector(
  selectSettingsState,
  (settingsState: SettingsState) => settingsState.navButton,
);

export const selectFontSize = createSelector(
  selectSettingsState,
  (settingsState: SettingsState) => settingsState.fontSize,
);

export const selectShowProgress = createSelector(
  selectSettingsState,
  (settingsState: SettingsState) => settingsState.showProgress,
);

export const selectRestoreProgress = createSelector(
  selectSettingsState,
  (settingsState: SettingsState) => settingsState.restoreProgress,
);

export const selectRestoreState = createSelector(
  selectSettingsState,
  (settingsState: SettingsState) => settingsState.restoreState,
);
