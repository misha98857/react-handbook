import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { loadLatestPageAction, saveLatestPageAction } from '../actions/history.actions';
import { Router } from '@angular/router';

@Injectable()
export class HistoryEffects {
  private saveLatestPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveLatestPageAction),
        map(({ url }) => Preferences.set({ key: 'latestPage', value: JSON.stringify(url) }))
      ),
    { dispatch: false }
  );

  private loadLatestPage = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadLatestPageAction),
        map(({ url }) => this.router.navigate([url]))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}