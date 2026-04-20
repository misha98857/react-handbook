export interface ArticleGroup {
  key: string;
  title?: string;
  values: Article[];
}

export interface Article {
  key: string;
  value: string;
  path: string;
  nav: string[];
  title?: string;
  examples?: string[];
  fallback?: boolean;
}

export interface SandpackExample {
  files: Record<string, string>;
  entry: string;
  dependencies: Record<string, string>;
  environment: 'react' | 'react-ts';
}

export type ExamplesMap = Record<string, SandpackExample>;
