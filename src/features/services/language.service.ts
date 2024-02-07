import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { ArticlesService } from './articles.service';
import { from, throwError } from 'rxjs';
import { ArticleGroup } from '../../entities/articles/models/articles';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private http: HttpClient,
    private articlesService: ArticlesService,
  ) {}

  downloadLanguage(language: string) {
    return this.http.get<ArticleGroup[]>(`https://misha98857.dev/react/articles/${language}.articles.json`, {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  saveArticlesFile(language: string, body: object) {
    try {
      return from(
        Filesystem.writeFile({
          path: `${language}.articles.json`,
          data: JSON.stringify(body),
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        }),
      );
    } catch (e) {
      void this.articlesService.presentErrorDownloadAlert();
      return throwError(() => new Error(`${e}`));
    }
  }
}
