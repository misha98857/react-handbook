import { createAction, props } from '@ngrx/store';
import { Articles } from '../../entities/articles/models/article';

export const loadReactArticlesSuccessAction = createAction(
  '[React Module] loadReactArticlesSuccess',
  props<{ articles: Array<Articles> }>(),
);

export const searchReactArticlesAction = createAction('[React Module] searchReactArticlesAction', props<{
  text: string
}>());

export const loadReactArticlesAction = createAction('[React Module] loadReactArticles');
