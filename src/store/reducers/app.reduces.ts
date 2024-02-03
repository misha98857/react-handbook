import { reactReducer } from './react.reducer';
import { IAppState } from '../state/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { progressReducer } from './progress.reducer';
import { settingsReducer } from './settings.reducer';
import { navigationReducer } from './navigation.reducer';

export const appReducers: ActionReducerMap<IAppState, never> = {
  react: reactReducer,
  router: routerReducer,
  progress: progressReducer,
  settings: settingsReducer,
  navigation: navigationReducer,
};