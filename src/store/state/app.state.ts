import { ReactState } from './react.state';
import { RouterReducerState } from '@ngrx/router-store';
import { ProgressState } from './progress.state';
import { SettingsState } from './settings.state';
import { NavigationState } from './navigation.state';

export interface AppState {
  react: ReactState;
  progress: ProgressState;
  router: RouterReducerState;
  settings: SettingsState;
  navigation: NavigationState;
}
