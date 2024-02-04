import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { loadLatestPageAction, saveLatestPageAction } from '../actions/history.actions';
import { Router } from '@angular/router';

@Injectable()
export class HistoryEffects {
  private saveLatestPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveLatestPageAction),
        switchMap(({ url }) => Preferences.set({ key: 'latestPage', value: JSON.stringify(url) })),
      ),
    { dispatch: false },
  );

  private loadLatestPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadLatestPageAction),
        switchMap(({ url }) => {
          const [targetUrl, fragment] = url.split('#');
          return this.router.navigate([targetUrl], { fragment: fragment });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}
}
