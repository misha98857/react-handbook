import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ArticleGroup } from '../../entities/articles/models/articles';
import {
  Platform,
  ToastController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonList,
  IonBadge,
} from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { App } from '@capacitor/app';
import { selectArticleGroups } from '../../store/selectors/articles.selectors';
import { selectReadProgressState } from '../../store/selectors/progress.selectors';
import { selectLanguage, selectShowProgress } from '../../store/selectors/settings.selectors';
import { ArticlesService } from '../../features/services/articles.service';
import { openWithProgressAction } from '../../store/actions/navigation.actions';
import { addIcons } from 'ionicons';
import { search, languageOutline } from 'ionicons/icons';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleListItemComponent } from '../../widgets/article-list-item/article-list-item.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    RouterLink,
    IonIcon,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonAccordionGroup,
    NgFor,
    IonAccordion,
    IonItem,
    IonLabel,
    IonList,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    IonBadge,
    NgSwitchDefault,
    AsyncPipe,
    TranslateModule,
    ArticleListItemComponent,
  ],
})

export class ArticlesComponent implements OnDestroy {
  articleGroups$: Observable<ArticleGroup[]> = this.store.select(selectArticleGroups);
  progress$: Observable<Record<string, number>> = this.store.select(selectReadProgressState);
  showProgress$: Observable<boolean> = this.store.select(selectShowProgress);
  language: Observable<string> = this.store.select(selectLanguage);

  private backButtonSubscribe: Subscription;
  private backCounter = 0;
  private changeLanguageSubscription: Subscription;

  constructor(
    private store: Store,
    private toastController: ToastController,
    private platform: Platform,
    private translate: TranslateService,
  ) {
    addIcons({ search, languageOutline });
  }

  ionViewWillEnter(): void {
    this.backButtonSubscribe = this.platform.backButton.subscribe(() => {
      this.backCounter += 1;
      if (this.backCounter === 1) {
        void this.onBackButtonPress();
        setTimeout(() => (this.backCounter = 0), 2000);
      }
      if (this.backCounter === 2) {
        App.exitApp();
      }
    });
  }

  ionViewDidLeave(): void {
    this.backButtonSubscribe.unsubscribe();
  }

  ngOnDestroy(): void {
    this.changeLanguageSubscription.unsubscribe();
  }

  openArticle(): void {
    this.store.dispatch(openWithProgressAction());
  }

  private async onBackButtonPress(): Promise<void> {
    const toast = await this.toastController.create({
      message: this.translate.instant('exit') as string,
      duration: 2000,
    });
    await toast.present();
  }
}
