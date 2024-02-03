import { createSelector } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { ISettingsState } from '../state/settings.state';

export const selectSettingsState = (state: IAppState): ISettingsState => state.settings;

export const selectAppTheme = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.darkTheme);

export const selectLanguage = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.language);

export const selectNavButtons = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.navButton);

export const selectOpenCount = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.openCount);

export const selectFontSize = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.fontSize);

export const selectVisibleProgress = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.visibleProgress);

export const selectRestoreProgress = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.restoreProgress);

export const selectRestoreState = createSelector(selectSettingsState, (settingsState: ISettingsState) => settingsState.restoreState);
