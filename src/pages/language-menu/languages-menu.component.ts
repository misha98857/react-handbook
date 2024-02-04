import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  LoadingController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { selectLanguage } from '../../store/selectors/settings.selectors';
import { changeAppLanguageAction } from '../../store/actions/settings.actions';
import { LanguageService } from '../../features/services/language.service';
import { ArticlesService } from '../../features/services/articles.service';
import { LanguageCardComponent } from '../../widgets/language-card/language-card.component';
import { NgFor, AsyncPipe } from '@angular/common';
import { Language } from '../../entities/languages/models/languages';

@Component({
  selector: 'app-languages-menu',
  templateUrl: './languages-menu.component.html',
  styleUrls: ['./languages-menu.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    NgFor,
    IonCol,
    LanguageCardComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class LanguagesMenuComponent {
  data = this.http.get<Language[]>('shared/assets/locale/languages.json');
  currentLang: Observable<string> = this.store.select(selectLanguage);
  private loadingPercentage = 0;
  private loadingProgressMessage: HTMLIonLoadingElement;

  constructor(private http: HttpClient, private translate: TranslateService, private store: Store, private loadingController: LoadingController, private articlesService: ArticlesService, private languageService: LanguageService) {
  }

  private async presentLoading() {
    this.loadingProgressMessage = await this.loadingController.create({
      message: `${this.translate.instant('download-localization')}${this.loadingPercentage}%`,
    });
    await this.loadingProgressMessage.present();
  }

  changeLanguage(language: string): void {
    // check if not downloaded, download and use it;
    if (['en', 'ru'].includes(language)) {
      this.store.dispatch(changeAppLanguageAction({ language }));
    } else {
      void this.downloadLanguagePack(language);
    }
  }

  private async downloadLanguagePack(language: string): Promise<void> {
    await this.presentLoading();
    this.languageService.downloadLanguage(language).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.DownloadProgress) {
          this.loadingPercentage = (event.loaded / event.total) * 100;
          this.loadingProgressMessage.message = `${this.translate.instant('download-localization')}${this.loadingPercentage.toFixed(0)}%`;
        } else if (event.type === HttpEventType.Response) {
          this.loadingProgressMessage.dismiss();
          this.loadingPercentage = 0;
          void this.languageService.saveArticlesFile(language, event.body);
        }
      }, error: () => {
        this.loadingProgressMessage.dismiss();
        this.loadingPercentage = 0;
        this.articlesService.presentErrorDownloadAlert();
      },
    });
  }
}
