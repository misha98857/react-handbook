import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  changeAppLanguageAction,
  decreaseFontSizeAction,
  increaseFontSizeAction,
  increaseOpenCountAction,
  initApplicationDataAction,
  toggleNavigationButtonAction,
  toggleRestoreProgressAction,
  toggleRestoreStateAction,
  toggleThemeAction,
  toggleVisibleProgressAction,
} from '../actions/settings.actions';
import { map } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { ReactService } from '../../services/react.service';
import { loadReactArticlesAction } from '../actions/react.actions';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { HttpEventType } from '@angular/common/http';
import { EMPTY } from 'rxjs';

@Injectable()
export class SettingsEffects {
  private toggleTheme = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleThemeAction),
        map(({ darkTheme }) => void Preferences.set({ key: 'darkTheme', value: darkTheme.toString() })),
      ),
    { dispatch: false },
  );

  private toggleNavButton = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleNavigationButtonAction),
        map(({ navButton }) => void Preferences.set({ key: 'navButton', value: navButton.toString() })),
      ),
    { dispatch: false },
  );

  private increaseOpenCount = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increaseOpenCountAction),
        map(({ openCount, language }) => {
          void Preferences.set({ key: 'openCount', value: openCount.toString() });
          setTimeout(() => {
            if (openCount === 1) {
              this.languageService.downloadLanguage(language).subscribe(event => {
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
          }, 1000);
        }),
      ),
    { dispatch: false },
  );

  private changeAppLanguage = createEffect(() =>
    this.actions$.pipe(
      ofType(changeAppLanguageAction),
      map(({ language }) => {
        this.translate.use(language);
        void Preferences.set({ key: 'language', value: language });
        return loadReactArticlesAction();
      }),
    ),
  );

  private increaseFontSize = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increaseFontSizeAction),
        map(({ fontSize }) => void Preferences.set({ key: 'fontSize', value: fontSize.toString() })),
      ),
    { dispatch: false },
  );

  private decreaseFontSize = createEffect(
    () =>
      this.actions$.pipe(
        ofType(decreaseFontSizeAction),
        map(({ fontSize }) => void Preferences.set({ key: 'fontSize', value: fontSize.toString() })),
      ),
    { dispatch: false },
  );

  private changeVisibleProgress = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleVisibleProgressAction),
        map(
          ({ visibleProgress }) =>
            void Preferences.set({
              key: 'visibleProgress',
              value: visibleProgress.toString(),
            }),
        ),
      ),
    { dispatch: false },
  );

  private changeRestoreProgress = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleRestoreProgressAction),
        map(
          ({ restoreProgress }) =>
            void Preferences.set({
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
        map(({ restoreState }) => void Preferences.set({ key: 'restoreState', value: restoreState.toString() })),
      ),
    { dispatch: false },
  );

  private initAppData = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initApplicationDataAction),
        map(({ settings }) => {
          void Preferences.set({ key: 'darkTheme', value: settings.darkTheme.toString() });
          void Preferences.set({ key: 'openCount', value: settings.openCount.toString() });
          void Preferences.set({ key: 'isRated', value: settings.isRated.toString() });
          void Preferences.set({ key: 'fontSize', value: settings.fontSize.toString() });
          void Preferences.set({ key: 'language', value: settings.language.toString() });
          void Preferences.set({ key: 'navButton', value: settings.navButton.toString() });
          void Preferences.set({ key: 'visibleProgress', value: settings.visibleProgress.toString() });
          void Preferences.set({ key: 'restoreProgress', value: settings.restoreProgress.toString() });
          void Preferences.set({ key: 'restoreState', value: settings.restoreState.toString() });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private reactService: ReactService,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) {
  }
}
