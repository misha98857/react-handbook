import { RouterReducerState } from '@ngrx/router-store';
import { NavigationState } from './navigation.state';

export interface AppState {
  router: RouterReducerState;
  navigation: NavigationState;
}
