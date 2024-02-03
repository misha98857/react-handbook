import { IAppState } from '../state/app.state';
import { IProgressState } from '../state/progress.state';

export const selectProgressState = (state: IAppState): IProgressState => state.progress;
