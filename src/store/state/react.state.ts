import { Articles } from '../../entities/articles/models/article';

export interface ReactState {
  articles: Array<Articles>;
  searchText: string;
}

// TODO: rename state to articles
export const initialReactState: ReactState = {
  articles: [],
  searchText: '',
};
