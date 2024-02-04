import { ArticleGroup } from '../../entities/articles/models/articles';

export interface ArticlesState {
  articleGroups: ArticleGroup[];
  searchText: string;
}

export const initialArticlesState: ArticlesState = {
  articleGroups: [],
  searchText: '',
};
