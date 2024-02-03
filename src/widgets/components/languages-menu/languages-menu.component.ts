import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular/standalone';
import { selectLanguage } from '../../../store/selectors/settings.selectors';
import { changeAppLanguageAction } from '../../../store/actions/settings.actions';
import { LanguageService } from '../../../features/services/language.service';
import { ReactService } from '../../../features/services/react.service';

@Component({
    selector: 'app-langs-menu',
    templateUrl: './languages-menu.component.html',
    styleUrls: ['./languages-menu.component.scss'],
})
export class LanguagesMenuComponent {

    public langs: any[];
    public data: any = this.http.get('shared/assets/locale/languages.json');
    public currentLang: Observable<string> = this.store.pipe(select(selectLanguage));
    private loadingPercentage = 0;
    private loadingProgressMessage;

    constructor(private http: HttpClient, private translate: TranslateService, private store: Store, private loadingController: LoadingController, private reactService: ReactService, private languageService: LanguageService) {
    }

    private async presentLoading() {
        this.loadingProgressMessage = await this.loadingController.create({
            message: `${this.translate.instant('download-localization')}${this.loadingPercentage}%`,
        });
        await this.loadingProgressMessage.present();
    }

    public changeLanguage(language: string): void {
        // check if not downloaded, download and use it;
        if (['en', 'ru'].includes(language)) {
            this.store.dispatch(changeAppLanguageAction({ language }));
        } else {
            this.downloadLanguagePack(language);
        }
    }

    private async downloadLanguagePack(language: string): Promise<void> {
        await this.presentLoading();
        this.languageService.downloadLanguage(language).subscribe((event) => {
            if (event.type === HttpEventType.DownloadProgress) {
                this.loadingPercentage = (event.loaded / event.total) * 100;
                this.loadingProgressMessage.message = `${this.translate.instant('download-localization')}${this.loadingPercentage.toFixed(0)}%`;
            } else if (event.type === HttpEventType.Response) {
                this.loadingProgressMessage.dismiss();
                this.loadingPercentage = 0;
                void this.languageService.saveArticlesFile(language, event.body);
            }
        }, (() => {
            this.loadingProgressMessage.dismiss();
            this.loadingPercentage = 0;
            this.reactService.presentErrorDownloadAlert();
        }));
    }

}
