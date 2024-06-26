import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Preferences } from '@capacitor/preferences';
import { computed, effect } from '@angular/core';

export interface ReadProgressStore {
  readProgressState: Record<string, number>;
}

export const initialReadProgressState: ReadProgressStore = {
  readProgressState: {},
};

export const ReadProgressStore = signalStore(
  { providedIn: 'root' },
  withState(initialReadProgressState),
  withComputed(store => ({
    readProgressState: computed(() => {
      return store.readProgressState();
    }),
  })),
  withMethods(store => ({
    updateReadProgress: (articleProgressState: Record<string, number>) => {
      patchState(store, (state: ReadProgressStore) => {
        return { readProgressState: { ...state.readProgressState, ...articleProgressState } };
      });
    },
  })),
  withHooks({
    onInit: store => {
      Preferences.get({ key: 'progress' }).then(({ value }) => {
        if (value) {
          patchState(store, state => ({ ...state, readProgressState: JSON.parse(value) }));
        }
      });

      effect(() => {
        const progressState = store.readProgressState();

        if (Object.values(progressState).length > 0) {
          void Preferences.set({ key: 'progress', value: JSON.stringify(progressState) });
        }
      });
    },
  }),
);
