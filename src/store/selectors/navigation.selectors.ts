import { AppState } from '../state/app.state';
import { NavigationState } from '../state/navigation.state';

export const selectNavigationState = (state: AppState): NavigationState => state.navigation;
