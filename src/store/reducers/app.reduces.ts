import { AppState } from '../state/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { progressReducer } from './progress.reducer';
import { navigationReducer } from './navigation.reducer';

export const appReducers: ActionReducerMap<AppState, never> = {
  router: routerReducer,
  progress: progressReducer,
  navigation: navigationReducer,
};
