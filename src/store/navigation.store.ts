import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface NavigationState {
  isSearch: boolean;
  isProgress: boolean;
  isInternalLink: boolean;
}

export const initialNavigationState: NavigationState = {
  isSearch: false,
  isProgress: false,
  isInternalLink: false,
};

export const NavigationStore = signalStore(
  { providedIn: 'root' },
  withState(initialNavigationState),
  withMethods(store => ({
    updateNavigationState: (navigationState: Partial<NavigationState>) => {
      patchState(store, (state: NavigationState) => {
        return { ...state, ...navigationState };
      });
    },
  })),
);
