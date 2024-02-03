export interface Articles {
  key: string;
  values: Array<Article>;
}

export interface Article {
  key: string;
  value: string;
  path: string;
  nav: Array<string>;
}
