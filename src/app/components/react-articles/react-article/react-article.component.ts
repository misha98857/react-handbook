import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectReactCurrentArticle } from '../../../store/selectors/react.selectors';
import { ReactService } from '../../../services/react.service';
import { Article } from '../../../models/article';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { selectFontSize, selectNavButtons, selectVisibleProgress } from '../../../store/selectors/settings.selectors';
import { selectProgressState } from '../../../store/selectors/progress.selectors';
import { openInternalLinkAction } from '../../../store/actions/navigation.actions';
import { decreaseFontSizeAction, increaseFontSizeAction } from '../../../store/actions/settings.actions';
import { first } from 'rxjs/operators';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';

@Component({
  selector: 'app-react-article',
  templateUrl: './react-article.component.html',
  styleUrls: ['./react-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactArticleComponent {
  @Input() articleKey: string;
  public article$: Observable<Article> = this.store.pipe(select(selectReactCurrentArticle));
  public fontSize: Observable<number> = this.store.pipe(select(selectFontSize));
  public navButtonsState: Observable<boolean> = this.store.pipe(select(selectNavButtons));
  public progress: Observable<Record<string, number>> = this.store.pipe(select(selectProgressState));
  public visibleProgress: Observable<boolean> = this.store.pipe(select(selectVisibleProgress));

  constructor(private store: Store, private reactService: ReactService, private router: Router) {}

  public increaseFontSize(): void {
    this.fontSize.pipe(first()).subscribe(fontSize => {
      this.store.dispatch(increaseFontSizeAction({ fontSize: fontSize + 0.1 }));
    });
  }

  public decreaseFontSize(): void {
    this.fontSize.pipe(first()).subscribe(fontSize => {
      this.store.dispatch(decreaseFontSizeAction({ fontSize: fontSize - 0.1 }));
    });
  }

  public getRoute(e: MouseEvent): void {
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
