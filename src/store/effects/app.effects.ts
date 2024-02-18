import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadArticlesAction, loadArticlesSuccessAction } from '../actions/articles.actions';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectLanguage } from '../selectors/settings.selectors';
import { ArticleGroup } from '../../entities/articles/models/articles';
import { LanguageService } from '../../features/services/language.service';

@Injectable()
export class AppEffects {
  private loadArticles = createEffect(() =>
    this.actions$.pipe(
      ofType(loadArticlesAction),
      switchMap(() => this.store.select(selectLanguage)),
      switchMap(language => {
        return this.languageService.loadArticlesFile(language);
      }),
      map((articleGroups: ArticleGroup[]) => {
        return loadArticlesSuccessAction({ articleGroups });
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private languageService: LanguageService,
  ) {}
}
