import { createSelector } from '@ngrx/store';
import { ArticlesState } from '../state/articles.state';
import { AppState } from '../state/app.state';
import { SerializedRouterStateSnapshot } from '@ngrx/router-store';
import { ArticleGroup } from '../../entities/articles/models/articles';

export const selectArticlesState = (state: AppState): ArticlesState => state.articles;
export const selectRouterState = (state: AppState): SerializedRouterStateSnapshot => state.router.state;

export const selectArticleGroups = createSelector(selectArticlesState, (articlesState: ArticlesState) => articlesState.articleGroups);

export const selectCurrentArticle = createSelector(
  selectArticlesState,
  selectRouterState,
  (reactState: ArticlesState, routerState: SerializedRouterStateSnapshot) => {
    const url: string = routerState.url.split('#')[0];

    for (const articleGroup of reactState.articleGroups) {
      for (const article of articleGroup.values) {
        if (url === article.path) {
          return article;
        }
      }
    }

    return { key: '', value: '', path: '', nav: ['', ''] };
  },
);

export const selectFragment = createSelector(
  selectRouterState,
  (routerState: SerializedRouterStateSnapshot) => routerState.root.fragment,
);

export const selectSearchedArticles = createSelector(selectArticlesState, (reactState: ArticlesState): ArticleGroup[] => {
  const searchedArticles: ArticleGroup[] = [];

  for (const groupArticles of reactState.articleGroups) {
    let groupHasFound = false;
    const searchedGroupArticles = [];

    for (const article of groupArticles.values) {
      if (article.value.includes(reactState.searchText) || article.key.includes(reactState.searchText)) {
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
  selectArticlesState,
  (reactState: ArticlesState): string => reactState.searchText,
);
