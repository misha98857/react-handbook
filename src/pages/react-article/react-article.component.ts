import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Article } from '../../entities/articles/models/articles';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { selectCurrentArticle } from '../../store/selectors/articles.selectors';
import {
  selectFontSize,
  selectNavButtons,
  selectShowProgress,
} from '../../store/selectors/settings.selectors';
import { selectProgressState } from '../../store/selectors/progress.selectors';
import { ReactService } from '../../features/services/react.service';
import { decreaseFontSizeAction, increaseFontSizeAction } from '../../store/actions/settings.actions';
import { openInternalLinkAction } from '../../store/actions/navigation.actions';
import { addIcons } from 'ionicons';
import { removeOutline, addOutline, arrowBackCircleOutline, arrowForwardCircleOutline } from 'ionicons/icons';
import { NgStyle, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe } from '@angular/common';
import { ReactHtmlArticleComponent } from '../react-html-article/react-html-article.component';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonBadge,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  ArticleNavigationToolbarComponent,
} from '../../widgets/navigation-toolbar/article-navigation-toolbar.component';

@Component({
  selector: 'app-react-article',
  templateUrl: './react-article.component.html',
  styleUrls: ['./react-article.component.scss'],
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
    ReactHtmlArticleComponent,
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
export class ReactArticleComponent {
  @Input() articleKey: string;
  article$: Observable<Article> = this.store.select(selectCurrentArticle);
  fontSize: Observable<number> = this.store.select(selectFontSize);
  navButtonsState: Observable<boolean> = this.store.select(selectNavButtons);
  progress: Observable<Record<string, number>> = this.store.select(selectProgressState);
  showProgress: Observable<boolean> = this.store.select(selectShowProgress);

  constructor(private store: Store, private reactService: ReactService, private router: Router) {
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
