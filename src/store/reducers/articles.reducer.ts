import { createReducer, on } from '@ngrx/store';
import { initialArticlesState } from '../state/articles.state';
import { loadArticlesSuccessAction, searchArticlesAction } from '../actions/articles.actions';

export const articlesReducer = createReducer(
  initialArticlesState,
  on(loadArticlesSuccessAction, (state, action) => ({
    ...state,
    articleGroups: action.articleGroups,
  })),
  on(searchArticlesAction, (state, action) => ({
    ...state,
    searchText: action.text,
  })),
);
