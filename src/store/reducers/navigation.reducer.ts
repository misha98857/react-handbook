import { createReducer, on } from '@ngrx/store';
import { initialNavigationState } from '../state/navigation.state';
import {
  openInternalLinkAction,
  openWithProgressAction,
  openWithSearchAction,
  returnDefaultNavigationStateAction,
} from '../actions/navigation.actions';

export const navigationReducer = createReducer(
  initialNavigationState,
  on(openInternalLinkAction, state => ({
    ...state,
    isSearch: false,
    isProgress: false,
    isInternalLink: true,
  })),
  on(openWithProgressAction, state => ({
    ...state,
    isSearch: false,
    isProgress: true,
    isInternalLink: false,
  })),
  on(openWithSearchAction, state => ({
    ...state,
    isSearch: true,
    isProgress: false,
    isInternalLink: false,
  })),
  on(returnDefaultNavigationStateAction, state => ({
    ...state,
    isSearch: false,
    isProgress: false,
    isInternalLink: false,
  })),
);
