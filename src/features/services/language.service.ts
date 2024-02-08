import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleGroup } from '../../entities/articles/models/articles';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private http: HttpClient) {}

  loadArticlesFile(language: string): Observable<ArticleGroup[]> {
    return this.http.get<ArticleGroup[]>(`shared/assets/articles/react/${language}.articles.json`);
  }
}
