import { ArticlesState } from './articles.state';
import { RouterReducerState } from '@ngrx/router-store';
import { ProgressState } from './progress.state';
import { SettingsState } from './settings.state';
import { NavigationState } from './navigation.state';

export interface AppState {
  articles: ArticlesState;
  progress: ProgressState;
  router: RouterReducerState;
  settings: SettingsState;
  navigation: NavigationState;
}
