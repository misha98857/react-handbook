import { ArticlesState } from './articles.state';
import { RouterReducerState } from '@ngrx/router-store';
import { ReadProgressState } from './read-progress.state';
import { SettingsState } from './settings.state';
import { NavigationState } from './navigation.state';

export interface AppState {
  articles: ArticlesState;
  progress: ReadProgressState;
  router: RouterReducerState;
  settings: SettingsState;
  navigation: NavigationState;
}
