import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { ReactService } from './react.service';
import { Store } from '@ngrx/store';
import { changeAppLanguageAction } from '../../store/actions/settings.actions';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  constructor(private http: HttpClient, private reactService: ReactService, private store: Store) {
  }

  downloadLanguage(language: string) {
    return this.http.get(`https://misha98857.dev/react/articles/${language}.articles.json`, {
      reportProgress: true,
      observe: 'events',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  async saveArticlesFile(language: string, body: object) {
    try {
      await Filesystem.writeFile({
        path: `${language}.articles.json`,
        data: JSON.stringify(body),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      this.store.dispatch(changeAppLanguageAction({ language }));
    } catch (e) {
      await this.reactService.presentErrorDownloadAlert();
    }
  }
}
