import { AppState } from '../state/app.state';
import { ProgressState } from '../state/progress.state';

export const selectProgressState = (state: AppState): ProgressState => state.progress;
