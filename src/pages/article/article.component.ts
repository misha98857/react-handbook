import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Article } from '../../entities/articles/models/articles';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { selectCurrentArticle } from '../../store/selectors/articles.selectors';
import { selectFontSize, selectNavButtons, selectShowProgress } from '../../store/selectors/settings.selectors';
import { selectReadProgressState } from '../../store/selectors/progress.selectors';
import { decreaseFontSizeAction, increaseFontSizeAction } from '../../store/actions/settings.actions';
import { openInternalLinkAction } from '../../store/actions/navigation.actions';
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
import { DomSanitizer } from '@angular/platform-browser';

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
  article$: Observable<Article> = this.store.select(selectCurrentArticle);
  fontSize: Observable<number> = this.store.select(selectFontSize);
  navButtonsState: Observable<boolean> = this.store.select(selectNavButtons);
  progress: Observable<Record<string, number>> = this.store.select(selectReadProgressState);
  showProgress: Observable<boolean> = this.store.select(selectShowProgress);

  constructor(
    private store: Store,
    private router: Router,
    private domSanitazer: DomSanitizer,
  ) {
    addIcons({ removeOutline, addOutline, arrowBackCircleOutline, arrowForwardCircleOutline });
  }

  increaseFontSize(): void {
    this.fontSize.pipe(first()).subscribe(fontSize => {
      this.store.dispatch(increaseFontSizeAction({ fontSize: fontSize + 0.1 }));
    });
  }

  decreaseFontSize(): void {
    this.fontSize.pipe(first()).subscribe(fontSize => {
      this.store.dispatch(decreaseFontSizeAction({ fontSize: fontSize - 0.1 }));
    });
  }

  getRoute(e: MouseEvent): void {
    const path = e?.composedPath() as HTMLElement[];
    // TODO handle url with type "localhost/react/incorrect-name
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
            this.store.dispatch(openInternalLinkAction());
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