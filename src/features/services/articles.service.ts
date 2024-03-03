import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleGroup } from '../../entities/articles/models/articles';
import { ArticlesStore } from '../../store/signal-store/articles.store';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly articlesStore = inject(ArticlesStore);
  private readonly mockLanguage = 'en';

  constructor(private http: HttpClient) {}

  loadArticlesFile(): void {
    const loadArticlesObservable = this.http.get<ArticleGroup[]>(
      `shared/assets/articles/react/${this.mockLanguage}.articles.json`,
    );

    this.articlesStore.updateArticleGroups(loadArticlesObservable);
  }
}
