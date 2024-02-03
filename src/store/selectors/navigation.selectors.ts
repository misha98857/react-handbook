import { IAppState } from '../state/app.state';
import { INavigationState } from '../state/navigation.state';

export const selectNavigationState = (state: IAppState): INavigationState => state.navigation;
