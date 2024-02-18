import { createAction } from '@ngrx/store';

export const openInternalLinkAction = createAction('[Navigation Module] open internalLink');

export const openWithProgressAction = createAction('[Navigation Module] open with progress');

export const openWithSearchAction = createAction('[Navigation Module] open page with search');

export const returnDefaultNavigationStateAction = createAction(
  '[Navigation Module] return navigation state to default',
);
