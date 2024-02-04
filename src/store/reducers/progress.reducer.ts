import { createReducer, on } from '@ngrx/store';
import { initialReadProgressState } from '../state/read-progress.state';
import {
  loadProgressStateAction,
  saveArticlesProgressStateAction,
  setArticleProgressStateAction,
} from '../actions/progress.actions';

export const progressReducer = createReducer(
  initialReadProgressState,
  on(loadProgressStateAction, (_, action) => ({
    ...action.progressState,
  })),
  on(setArticleProgressStateAction, (state, action) => ({
    ...state,
    [action.key]: +action.value,
  })),
  on(saveArticlesProgressStateAction, (state) => state),
);
