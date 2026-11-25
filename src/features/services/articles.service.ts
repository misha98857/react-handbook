import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleGroup, ExamplesMap } from '../../entities/articles/models/articles';
import { ArticlesStore } from '../../store/articles.store';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly articlesStore = inject(ArticlesStore);
  private readonly http = inject(HttpClient);

  loadArticlesFile(language: string): void {
    const loadArticlesObservable = this.http.get<ArticleGroup[]>(
      `shared/assets/articles/react/${language}.articles.json`,
    );

    this.articlesStore.updateArticleGroups(loadArticlesObservable);

    const loadExamplesObservable = this.http
      .get<ExamplesMap>(`shared/assets/articles/react/${language}.examples.json`)
      .pipe(catchError(() => of<ExamplesMap>({})));

    this.articlesStore.updateExamples(loadExamplesObservable);
  }
}
