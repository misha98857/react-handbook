import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { loadArticlesAction, loadArticlesSuccessAction } from '../actions/articles.actions';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectLanguage } from '../selectors/settings.selectors';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { from, Observable, of } from 'rxjs';
import { increaseOpenArticleCountAction } from '../actions/navigation.actions';
import { Preferences } from '@capacitor/preferences';
import { ArticleGroup } from '../../entities/articles/models/articles';
import { LanguageService } from '../../features/services/language.service';

@Injectable()
export class AppEffects {
  private loadArticles = createEffect(() =>
    this.actions$.pipe(
      ofType(loadArticlesAction),
      switchMap(() => this.store.select(selectLanguage)),
      switchMap(language => {
        if (['en', 'ru'].includes(language)) {
          return this.loadArticlesFile(language);
        }
        return this.loadDownloadedArticles(language);
      }),
      map((articleGroups: ArticleGroup[]) => {
        return loadArticlesSuccessAction({ articleGroups });
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

          return Preferences.set({ key: 'openArticleCount', value: openArticleCountNumber.toString() });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store,
    private languageService: LanguageService,
  ) {}

  private loadArticlesFile(language: string): Observable<ArticleGroup[]> {
    return this.http.get<ArticleGroup[]>(`shared/assets/articles/react/${language}.articles.json`);
  }

  private loadDownloadedArticles(language: string): Observable<ArticleGroup[]> {
    return from(Filesystem.stat({ path: `${language}.articles.json`, directory: Directory.Data })).pipe(
      switchMap(() =>
        Filesystem.readFile({
          path: `${language}.articles.json`,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        }),
      ),
      map(fileReadResult => {
        const fileReadResultData = fileReadResult.data as string;
        return JSON.parse(fileReadResultData) as ArticleGroup[];
      }),
      catchError(() => this.downloadArticlesFile(language)),
    );
  }

  private downloadArticlesFile(language: string): Observable<ArticleGroup[]> {
    return this.languageService.downloadLanguage(language).pipe(
      concatMap(data => {
        if (data.type === HttpEventType.Response) {
          return this.languageService.saveArticlesFile(language, data.body).pipe(map(() => data.body));
        }
        return of([]);
      }),
      catchError(() => this.loadArticlesFile('en')),
    );
  }
}
