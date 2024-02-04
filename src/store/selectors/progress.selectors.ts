import { AppState } from '../state/app.state';
import { ReadProgressState } from '../state/read-progress.state';

export const selectReadProgressState = (state: AppState): ReadProgressState => state.progress;
