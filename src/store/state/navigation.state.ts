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
