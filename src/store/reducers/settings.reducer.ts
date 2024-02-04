import { createReducer, on } from '@ngrx/store';
import { initialSettingsState } from '../state/settings.state';
import {
  changeAppLanguageAction,
  decreaseFontSizeAction,
  increaseFontSizeAction,
  increaseOpenCountAction,
  initApplicationDataAction,
  toggleNavigationButtonAction,
  toggleRestoreProgressAction,
  toggleRestoreStateAction,
  toggleShowProgressAction,
  toggleThemeAction,
} from '../actions/settings.actions';

export const settingsReducer = createReducer(
  initialSettingsState,
  on(initApplicationDataAction, (_, action) => action.settings),
  on(toggleThemeAction, (state, action) => ({
    ...state,
    darkTheme: action.darkTheme,
  })),
  on(toggleNavigationButtonAction, (state, action) => ({
    ...state,
    navButton: action.navButton,
  })),
  on(increaseOpenCountAction, (state, action) => ({
    ...state,
    openCount: action.openCount,
  })),
  on(changeAppLanguageAction, (state, action) => ({
    ...state,
    language: action.language,
  })),
  on(increaseFontSizeAction, (state, action) => ({
    ...state,
    fontSize: action.fontSize,
  })),
  on(decreaseFontSizeAction, (state, action) => ({
    ...state,
    fontSize: action.fontSize,
  })),
  on(toggleShowProgressAction, (state, action) => ({
    ...state,
    showProgress: action.showProgress,
  })),
  on(toggleRestoreProgressAction, (state, action) => ({
    ...state,
    restoreProgress: action.restoreProgress,
  })),
  on(toggleRestoreStateAction, (state, action) => ({
    ...state,
    restoreState: action.restoreState,
  })),
);
