import { RouterReducerState } from '@ngrx/router-store';
import { ReadProgressState } from './read-progress.state';
import { NavigationState } from './navigation.state';

export interface AppState {
  progress: ReadProgressState;
  router: RouterReducerState;
  navigation: NavigationState;
}
