import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  Platform,
  ToastController,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { App } from '@capacitor/app';
import { openWithProgressAction } from '../../store/actions/navigation.actions';
import { addIcons } from 'ionicons';
import { languageOutline, search } from 'ionicons/icons';
import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleListItemComponent } from '../../widgets/article-list-item/article-list-item.component';
import { GithubStarComponent } from '../../widgets/github-star/github-star.component';
import { ArticlesStore } from '../../store/signal-store/articles.store';
import { SettingsStore } from '../../store/signal-store/settings.store';
import { ReadProgressStore } from '../../store/signal-store/read-progress.store';

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
    GithubStarComponent,
    IonSkeletonText,
    NgTemplateOutlet,
  ],
})
export class ArticlesComponent implements OnDestroy {
  readonly articlesStore = inject(ArticlesStore);
  readonly settingsStore = inject(SettingsStore);
  readonly readProgressStore = inject(ReadProgressStore);

  skeletonLoadingItems = [...Array(8).keys()];

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
