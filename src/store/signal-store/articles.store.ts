import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ArticleGroup } from '../../entities/articles/models/articles';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

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
  withMethods(store => ({
    updateArticleGroups: rxMethod<ArticleGroup[]>(
      pipe(
        map(articleGroups => {
          patchState(store, state => ({ ...state, articleGroups }));
        }),
      ),
    ),
  })),
);
