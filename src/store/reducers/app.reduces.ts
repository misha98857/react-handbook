import { articlesReducer } from './articles.reducer';
import { AppState } from '../state/app.state';
import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { progressReducer } from './progress.reducer';
import { settingsReducer } from './settings.reducer';
import { navigationReducer } from './navigation.reducer';

export const appReducers: ActionReducerMap<AppState, never> = {
  articles: articlesReducer,
  router: routerReducer,
  progress: progressReducer,
  settings: settingsReducer,
  navigation: navigationReducer,
};
