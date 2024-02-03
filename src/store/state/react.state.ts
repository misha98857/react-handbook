import { Articles } from '../../entities/articles/models/article';

export interface IReactState {
  articles: Array<Articles>;
  searchText: string;
}

export const initialReactState: IReactState = {
  articles: [],
  searchText: '',
};
