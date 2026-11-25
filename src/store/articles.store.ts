import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { ArticleGroup, ExamplesMap, SandpackExample } from '../entities/articles/models/articles';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { computed, inject } from '@angular/core';
import { Location } from '@angular/common';

export interface ArticlesState {
  articleGroups: ArticleGroup[];
  examples: ExamplesMap;
  searchText: string;
  urlPath: string;
  fragment: string;
}

export const initialArticlesState: ArticlesState = {
  articleGroups: [],
  examples: {},
  searchText: '',
  urlPath: '/react',
  fragment: '',
};

export const ArticlesStore = signalStore(
  { providedIn: 'root' },
  withState(initialArticlesState),
  withComputed(store => ({
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
    updateExamples: rxMethod<ExamplesMap>(
      pipe(
        map(examples => {
          patchState(store, state => ({ ...state, examples }));
        }),
      ),
    ),
    getExample: (id: string): SandpackExample | undefined => store.examples()[id],
    updateSearchText: (searchText: string) => {
      patchState(store, state => ({ ...state, searchText }));
    },
  })),
  withHooks((store, location = inject(Location)) => ({
    onInit: () => {
      location.onUrlChange(() => {
        const [path, fragment] = location.path(true).split('#');
        patchState(store, state => ({ ...state, urlPath: path, fragment }));
      });
    },
  })),
);
