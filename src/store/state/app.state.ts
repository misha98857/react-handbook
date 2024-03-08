import { RouterReducerState } from '@ngrx/router-store';
import { ReadProgressState } from './read-progress.state';
import { SettingsState } from './settings.state';
import { NavigationState } from './navigation.state';

export interface AppState {
  progress: ReadProgressState;
  router: RouterReducerState;
  settings: SettingsState;
  navigation: NavigationState;
}
