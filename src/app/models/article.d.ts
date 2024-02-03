export interface Articles {
  key: string;
  values: Article[];
}

export interface Article {
  key: string;
  value: string;
  path: string;
  nav: string[];
}
