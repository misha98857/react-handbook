import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Preferences } from '@capacitor/preferences';

const initialHistoryState = {
  latestPage: '',
};

// TODO: load initial state from preferences from onInit signal store hook
/*
const [targetUrl, fragment] = url.split('#');
return this.router.navigate([targetUrl], { fragment: fragment });
*/
export const HistoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialHistoryState),
  withMethods(store => ({
    updateLatestPage: (page: string) => {
      patchState(store, { latestPage: page });
      void Preferences.set({ key: 'latestPage', value: JSON.stringify(page) });
    },
  })),
);
