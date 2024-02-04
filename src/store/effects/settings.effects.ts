import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  changeAppLanguageAction,
  decreaseFontSizeAction,
  increaseFontSizeAction,
  initApplicationDataAction,
  toggleNavigationButtonAction,
  toggleRestoreProgressAction,
  toggleRestoreStateAction,
  toggleThemeAction,
  toggleShowProgressAction,
} from '../actions/settings.actions';
import { map, switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { loadReactArticlesAction } from '../actions/react.actions';
import { TranslateService } from '@ngx-translate/core';
import { HttpEventType } from '@angular/common/http';
import { EMPTY, forkJoin } from 'rxjs';
import { ReactService } from '../../features/services/react.service';
import { LanguageService } from '../../features/services/language.service';
import { SettingsState } from '../state/settings.state';

@Injectable()
export class SettingsEffects {
  private toggleTheme = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleThemeAction),
        switchMap(({ darkTheme }) => void Preferences.set({ key: 'darkTheme', value: darkTheme.toString() })),
      ),
    { dispatch: false },
  );

  private toggleNavButton = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleNavigationButtonAction),
        switchMap(({ navButton }) => void Preferences.set({ key: 'navButton', value: navButton.toString() })),
      ),
    { dispatch: false },
  );

  private changeAppLanguage = createEffect(() =>
    this.actions$.pipe(
      ofType(changeAppLanguageAction),
      switchMap(({ language }) => {
        this.translate.use(language);
        return Preferences.set({ key: 'language', value: language });
      }),
      map(() => loadReactArticlesAction()),
    ),
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
        switchMap(
          ({ showProgress }) => Preferences.set({
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
        switchMap(
          ({ restoreProgress }) => Preferences.set({
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
            Object.entries({ ...settings }).map(([key, value]) => Preferences.set({ key, value: value.toString() })),
          ),
        ),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) {
  }

  // TODO: save download articles attempt to local storage
  private downloadArticlesFile(language: string) {
    return this.languageService.downloadLanguage(language).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        if (event.status < 300) {
          void this.languageService.saveArticlesFile(language, event.body);
        } else {
          changeAppLanguageAction({ language: 'en' });
          return EMPTY;
        }
      }
    });
  }
}
