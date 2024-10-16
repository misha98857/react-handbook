import { ChangeDetectionStrategy, Component, computed, inject, Input, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { addIcons } from 'ionicons';
import { addOutline, arrowBackCircleOutline, arrowForwardCircleOutline, removeOutline } from 'ionicons/icons';
import { AsyncPipe, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ArticleRenderComponent } from '../article-render/article-render.component';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ArticleNavigationToolbarComponent } from '../../widgets/navigation-toolbar/article-navigation-toolbar.component';
import { ArticlesStore } from '../../store/articles.store';
import { SettingsStore } from '../../store/settings.store';
import { ReadProgressStore } from '../../store/read-progress.store';
import { NavigationStore } from '../../store/navigation.store';
import { Article } from '../../entities/articles/models/articles';

@Component({
  selector: 'app-react-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonMenuButton,
    IonTitle,
    IonContent,
    ArticleRenderComponent,
    NgStyle,
    IonFooter,
    NgIf,
    IonTabs,
    IonTabBar,
    IonTabButton,
    RouterLink,
    NgSwitch,
    NgSwitchCase,
    IonBadge,
    NgSwitchDefault,
    IonLabel,
    AsyncPipe,
    ArticleNavigationToolbarComponent,
  ],
})
export class ArticleComponent {
  @Input() articleKey: string;

  readonly articlesStore = inject(ArticlesStore);
  readonly settingsStore = inject(SettingsStore);
  readonly readProgressStore = inject(ReadProgressStore);
  readonly navigationStore = inject(NavigationStore);
  readonly router = inject(Router);

  currentArticle: Signal<Article> = computed(() => {
    const url = this.articlesStore.urlPath();
    const fallbackArticle = { key: '', value: '', path: '', nav: ['', ''] };
    const currentArticle = this.articlesStore
      .articleGroups()
      .flatMap(group => group.values)
      .find(article => article.path === url);

    return currentArticle ?? fallbackArticle;
  });

  constructor() {
    addIcons({ removeOutline, addOutline, arrowBackCircleOutline, arrowForwardCircleOutline });
  }

  increaseFontSize(): void {
    this.settingsStore.updateSettings({ fontSize: this.settingsStore.fontSize() + 0.1 });
  }

  decreaseFontSize(): void {
    this.settingsStore.updateSettings({ fontSize: this.settingsStore.fontSize() - 0.1 });
  }

  getRoute(e: MouseEvent): void {
    const path = e?.composedPath() as HTMLElement[];

    for (const node of path) {
      if (node.localName === 'img') {
        const src = node.attributes.getNamedItem('src') ?? { value: '' };
        const { value = '' } = src;
        if (value) {
          location.assign(value);
        }
      }

      if (node.localName === 'a') {
        const href = node.attributes.getNamedItem('href') ?? { value: '' };
        const { value = '' } = href;
        if (value) {
          if (value.startsWith('/react/')) {
            void this.router.navigateByUrl(value);
            this.navigationStore.updateNavigationState({ isInternalLink: true });
            e.preventDefault();
          } else {
            InAppBrowser.create(value);
            e.preventDefault();
          }
        }
      }
    }
  }
}
