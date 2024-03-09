import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Preferences } from '@capacitor/preferences';

const initialHistoryState = {
  latestPage: '',
};

export const HistoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialHistoryState),
  withMethods(store => ({
    updateLatestPage: (page: string) => {
      patchState(store, { latestPage: page });
      void Preferences.set({ key: 'latestPage', value: JSON.stringify(page) });
    },
  })),
  withHooks(store => ({
    onInit: () => {
      Preferences.get({ key: 'latestPage' }).then(({ value }) => {
        patchState(store, { latestPage: value });
      });
    },
  })),
);
