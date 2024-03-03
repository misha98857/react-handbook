import { createAction, props } from '@ngrx/store';
import { ArticleGroup } from '../../entities/articles/models/articles';

export const loadArticlesSuccessAction = createAction(
  '[React Module] loadArticlesSuccess',
  props<{ articleGroups: ArticleGroup[] }>(),
);

export const searchArticlesAction = createAction(
  '[React Module] searchArticlesAction',
  props<{
    text: string;
  }>(),
);
