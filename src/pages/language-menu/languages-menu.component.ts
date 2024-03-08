import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LanguageCardComponent } from '../../widgets/language-card/language-card.component';
import { AsyncPipe, NgFor } from '@angular/common';
import { Language } from '../../entities/languages/models/languages';
import { SettingsStore } from '../../store/signal-store/settings.store';

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
  readonly settingsStore = inject(SettingsStore);

  data = this.http.get<Language[]>('shared/assets/locale/languages.json');

  constructor(private http: HttpClient) {}

  changeLanguage(language: string): void {
    this.settingsStore.updateSettings({ language });
  }
}
