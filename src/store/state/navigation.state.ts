export interface INavigationState {
  isSearch: boolean;
  isProgress: boolean;
  isInternalLink: boolean;
}

export const initialNavigationState: INavigationState = {
  isSearch: false,
  isProgress: false,
  isInternalLink: false,
};
