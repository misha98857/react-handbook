import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ArticleGroup } from '../../entities/articles/models/articles';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';

export interface ArticlesState {
  articleGroups: ArticleGroup[];
  searchText: string;
}

export const initialArticlesState: ArticlesState = {
  articleGroups: [],
  searchText: '',
};

export const ArticlesStore = signalStore(
  { providedIn: 'root' },
  withState(initialArticlesState),
  withComputed((store, routerStore = inject(Store)) => ({
    currentArticle: computed(() => {
      const urlSignal = routerStore.selectSignal((state: AppState) => state.router.state.url);
      const url: string = urlSignal().split('#')[0];

      for (const articleGroup of store.articleGroups()) {
        for (const article of articleGroup.values) {
          if (url === article.path) {
            return article;
          }
        }
      }

      return { key: '', value: '', path: '', nav: ['', ''] };
    }),
    currentFragment: computed(() => {
      return routerStore.selectSignal((state: AppState) => state.router.state.root.fragment)();
    }),
    searchedArticles: computed(() => {
      const searchedArticles: ArticleGroup[] = [];

      for (const groupArticles of store.articleGroups()) {
        let groupHasFound = false;
        const searchedGroupArticles = [];

        for (const article of groupArticles.values) {
          if (article.value.includes(store.searchText()) || article.key.includes(store.searchText())) {
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
    }),
  })),
  withMethods(store => ({
    updateArticleGroups: rxMethod<ArticleGroup[]>(
      pipe(
        map(articleGroups => {
          patchState(store, state => ({ ...state, articleGroups }));
        }),
      ),
    ),
    updateSearchText: (searchText: string) => {
      patchState(store, state => ({ ...state, searchText }));
    },
  })),
);
