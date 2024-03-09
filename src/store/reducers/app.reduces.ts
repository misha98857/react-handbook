import { AppState } from '../state/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { navigationReducer } from './navigation.reducer';

export const appReducers: ActionReducerMap<AppState, never> = {
  router: routerReducer,
  navigation: navigationReducer,
};
