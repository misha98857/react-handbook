import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { saveArticlesProgressStateAction } from '../actions/progress.actions';

@Injectable()
export class ProgressEffects {
  private changeProgress = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveArticlesProgressStateAction),
        switchMap(({ progressState }) => Preferences.set({ key: 'progress', value: JSON.stringify(progressState) })),
      ),
    { dispatch: false },
  );

  constructor(private actions$: Actions) {
  }
}
