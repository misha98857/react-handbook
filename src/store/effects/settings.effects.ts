import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  changeAppLanguageAction,
  decreaseFontSizeAction,
  increaseFontSizeAction,
  initApplicationDataAction,
  toggleNavigationButtonAction,
  toggleRestoreProgressAction,
  toggleRestoreStateAction,
  toggleShowProgressAction,
  toggleThemeAction,
} from '../actions/settings.actions';
import { map, switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { ArticlesService } from '../../features/services/articles.service';

@Injectable()
export class SettingsEffects {
  private readonly articlesService = inject(ArticlesService);

  private toggleTheme = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleThemeAction),
        switchMap(({ darkTheme }) => Preferences.set({ key: 'darkTheme', value: darkTheme.toString() })),
      ),
    { dispatch: false },
  );

  private toggleNavButton = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleNavigationButtonAction),
        switchMap(({ navButton }) => Preferences.set({ key: 'navButton', value: navButton.toString() })),
      ),
    { dispatch: false },
  );

  private changeAppLanguage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeAppLanguageAction),
        switchMap(({ language }) => {
          this.translate.use(language);
          return Preferences.set({ key: 'language', value: language });
        }),
        map(() => {
          this.articlesService.loadArticlesFile();
        }),
      ),
    { dispatch: false },
  );

  private increaseFontSize = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increaseFontSizeAction),
        switchMap(({ fontSize }) => Preferences.set({ key: 'fontSize', value: fontSize.toString() })),
      ),
    { dispatch: false },
  );

  private decreaseFontSize = createEffect(
    () =>
      this.actions$.pipe(
        ofType(decreaseFontSizeAction),
        switchMap(({ fontSize }) => Preferences.set({ key: 'fontSize', value: fontSize.toString() })),
      ),
    { dispatch: false },
  );

  private changeShowProgress = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleShowProgressAction),
        switchMap(({ showProgress }) =>
          Preferences.set({
            key: 'showProgress',
            value: showProgress.toString(),
          }),
        ),
      ),
    { dispatch: false },
  );

  private changeRestoreProgress = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleRestoreProgressAction),
        switchMap(({ restoreProgress }) =>
          Preferences.set({
            key: 'restoreProgress',
            value: restoreProgress.toString(),
          }),
        ),
      ),
    { dispatch: false },
  );

  private changeRestoreState = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleRestoreStateAction),
        switchMap(({ restoreState }) => Preferences.set({ key: 'restoreState', value: restoreState.toString() })),
      ),
    { dispatch: false },
  );

  private initAppData = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initApplicationDataAction),
        switchMap(({ settings }) =>
          forkJoin(
            Object.entries({ ...settings }).map(([key, value]) =>
              value !== null ? Preferences.set({ key, value: value.toString() }) : of(),
            ),
          ),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private translate: TranslateService,
  ) {}
}
