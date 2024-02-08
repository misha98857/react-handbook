import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
import { selectLanguage } from '../../store/selectors/settings.selectors';
import { changeAppLanguageAction } from '../../store/actions/settings.actions';
import { LanguageCardComponent } from '../../widgets/language-card/language-card.component';
import { AsyncPipe, NgFor } from '@angular/common';
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

  constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  changeLanguage(language: string): void {
    this.store.dispatch(changeAppLanguageAction({ language }));
  }
}
