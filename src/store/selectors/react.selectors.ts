import { createSelector } from '@ngrx/store';
import { ReactState } from '../state/react.state';
import { AppState } from '../state/app.state';
import { SerializedRouterStateSnapshot } from '@ngrx/router-store';
import { Articles } from '../../entities/articles/models/article';

export const selectReactState = (state: AppState): ReactState => state.react;
export const selectRouterState = (state: AppState): SerializedRouterStateSnapshot => state.router.state;

export const selectReactArticles = createSelector(selectReactState, (reactState: ReactState) => reactState.articles);

export const selectReactCurrentArticle = createSelector(
  selectReactState,
  selectRouterState,
  (reactState: ReactState, routerState: SerializedRouterStateSnapshot) => {
    let url: string = routerState.url;
    if (routerState.root.fragment) {
      url = url.replace(`#${routerState.root.fragment}`, '');
    }
    for (const i of reactState.articles) {
      for (const j of i.values) {
        if (url === j.path) {
          return j;
        }
      }
    }

    return { key: '', value: '', path: '', nav: ['', ''] };
  },
);

export const selectReactFragment = createSelector(
  selectRouterState,
  (routerState: SerializedRouterStateSnapshot) => routerState.root.fragment,
);

export const selectSearchedReactArticles = createSelector(selectReactState, (reactState: ReactState): Articles[] => {
  const searchedArticles: Articles[] = [];

  for (const groupArticles of reactState.articles) {
    let groupHasFound = false;
    const searchedGroupArticles = [];

    for (const article of groupArticles.values) {
      if (article.value.indexOf(reactState.searchText) !== -1 || article.key.indexOf(reactState.searchText) !== -1) {
        searchedGroupArticles.push(article);
        groupHasFound = true;
      }
    }

    if (groupHasFound) {
      const groupKey = groupArticles.key;
      const element = { key: groupKey, values: searchedGroupArticles };
      searchedArticles.push(element);
    }
  }
  return searchedArticles;
});

export const selectSearchText = createSelector(
  selectReactState,
  (reactState: ReactState): string => reactState.searchText,
);
