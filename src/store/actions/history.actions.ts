import { createAction, props } from '@ngrx/store';

export const saveLatestPageAction = createAction('[History Module] change latest page', props<{ url: string }>());

export const loadLatestPageAction = createAction('[History Module] load latest page', props<{ url: string }>());
