import { IReactState } from './react.state';
import { RouterReducerState } from '@ngrx/router-store';
import { IProgressState } from './progress.state';
import { ISettingsState } from './settings.state';
import { INavigationState } from './navigation.state';

export interface IAppState {
  react: IReactState;
  progress: IProgressState;
  router: RouterReducerState;
  settings: ISettingsState;
  navigation: INavigationState;
}
