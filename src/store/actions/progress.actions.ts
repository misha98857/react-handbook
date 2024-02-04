import { createAction, props } from '@ngrx/store';

export const loadProgressStateAction = createAction(
  '[Progress Module] load progress state',
  props<{ progressState: Record<string, number> }>(),
);

export const setArticleProgressStateAction = createAction(
  '[Progress Module] set article progress state',
  props<{ key: string; value: string }>(),
);

export const saveArticlesProgressStateAction = createAction(
  '[Progress Module] save articles progress state',
  props<{ progressState: Record<string, number> }>(),
);
