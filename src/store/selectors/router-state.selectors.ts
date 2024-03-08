import { AppState } from '../state/app.state';
import { SerializedRouterStateSnapshot } from '@ngrx/router-store';

export const selectRouterState = (state: AppState): SerializedRouterStateSnapshot => state.router.state;
