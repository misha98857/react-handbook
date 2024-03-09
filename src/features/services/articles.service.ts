import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleGroup } from '../../entities/articles/models/articles';
import { ArticlesStore } from '../../store/articles.store';
import { SettingsStore } from '../../store/settings.store';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly articlesStore = inject(ArticlesStore);
  private readonly settingsStore = inject(SettingsStore);

  constructor(private http: HttpClient) {}

  loadArticlesFile(): void {
    const loadArticlesObservable = this.http.get<ArticleGroup[]>(
      `shared/assets/articles/react/${this.settingsStore.language()}.articles.json`,
    );

    this.articlesStore.updateArticleGroups(loadArticlesObservable);
  }
}
