import { createAction, props } from '@ngrx/store';
import { ISettingsState } from '../state/settings.state';

export const initApplicationDataAction = createAction('[Settings Module] initApplicationDataAction', props<{ settings: ISettingsState }>());

export const toggleThemeAction = createAction('[Settings Module] toggleThemeAction', props<{ darkTheme: boolean }>());

export const toggleNavigationButtonAction = createAction('[Settings Module] toggleNavigationButtonAction', props<{ navButton: boolean }>());

export const changeAppLanguageAction = createAction('[Settings Module] toggleAppLanguageAction', props<{ language: string }>());

export const rateAppAction = createAction('[Settings Module] rateAppAction');

export const increaseOpenCountAction = createAction(
  '[Settings Module] increaseOpenCountAction',
  props<{ openCount: number; isRated: boolean, language: string }>()
);

export const increaseFontSizeAction = createAction('[Settings Module] increaseFontSize', props<{ fontSize: number }>());

export const decreaseFontSizeAction = createAction('[Settings Module] decreaseFontSize', props<{ fontSize: number }>());

export const toggleVisibleProgressAction = createAction(
  '[Settings Module] changeVisibleProgressAction',
  props<{ visibleProgress: boolean }>()
);

export const toggleRestoreProgressAction = createAction(
  '[Settings Module] changeRestoreProgressAction',
  props<{ restoreProgress: boolean }>()
);

export const toggleRestoreStateAction = createAction('[Settings Module] changeRestoreStateAction', props<{ restoreState: boolean }>());
