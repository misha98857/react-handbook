import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { loadReactArticlesAction, loadReactArticlesSuccessAction } from '../actions/react.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { selectLanguage } from '../selectors/settings.selectors';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { from, Observable } from 'rxjs';
import { increaseOpenArticleCountAction } from '../actions/navigation.actions';
import { Preferences } from '@capacitor/preferences';
import { Articles } from '../../entities/articles/models/article';

@Injectable()
export class AppEffects {
  private loadArticles = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReactArticlesAction),
      switchMap(() => this.store.select(selectLanguage)),
      switchMap(language => {
        if (['en', 'ru'].includes(language)) {
          return this.loadArticlesFile(language);
        }
        return this.loadDownloadedArticles(language);
      }),
      map((articles: Array<Articles>) => {
        return loadReactArticlesSuccessAction({ articles });
      }),
    ),
  );

  // TODO: need refactor or delete
  private openArticle = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increaseOpenArticleCountAction),
        switchMap(async () => {
          const { value: openArticleCount } = await Preferences.get({ key: 'openArticleCount' });
          const openArticleCountNumber = +(openArticleCount ?? '0') + 1;

          await Preferences.set({ key: 'openArticleCount', value: openArticleCountNumber.toString() });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private translate: TranslateService,
    private store: Store,
  ) {
  }

  private loadArticlesFile(language: string): Observable<Articles[]> {
    return this.http.get<Articles[]>(`shared/assets/articles/react/${language}.articles.json`);
  }

  private loadDownloadedArticles(language: string): Observable<Articles[]> {
    return from(
      Filesystem.readFile({
        path: `${language}.articles.json`,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      }),
    ).pipe(
      map(fileReadResult => {
        const fileReadResultData = fileReadResult.data as string;
        return JSON.parse(fileReadResultData) as Articles[];
      }),
      catchError(() => this.loadArticlesFile('en')),
    );
  }
}
