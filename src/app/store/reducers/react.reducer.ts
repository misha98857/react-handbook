import { createReducer, on } from '@ngrx/store';
import { initialReactState } from '../state/react.state';
import {
  loadReactArticlesAction,
  loadReactArticlesSuccessAction,
  searchReactArticlesAction
} from '../actions/react.actions';

export const reactReducer = createReducer(
  initialReactState,
  on(loadReactArticlesSuccessAction, (state, action) => ({
      ...state,
      articles: action.articles
    })),
  on(searchReactArticlesAction, (state, action) => ({
      ...state,
      searchText: action.text
    })),
  on(loadReactArticlesAction, (state) => ({ ...state }))
);
