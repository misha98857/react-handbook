import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef, ElementRef, inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, withLatestFrom } from 'rxjs';
import { Article } from '../../entities/articles/models/articles';
import { Store } from '@ngrx/store';
import { IonContent } from '@ionic/angular/standalone';
import * as Mark from 'mark.js';
import { first } from 'rxjs/operators';
import { selectFragment, selectSearchText } from '../../store/selectors/articles.selectors';
import { selectRestoreProgress } from '../../store/selectors/settings.selectors';
import { NavigationState } from '../../store/state/navigation.state';
import { selectNavigationState } from '../../store/selectors/navigation.selectors';
import { setArticleProgressStateAction } from '../../store/actions/progress.actions';
import {
  increaseOpenArticleCountAction,
  returnDefaultNavigationStateAction,
} from '../../store/actions/navigation.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-html-html-article',
  templateUrl: './article-render.component.html',
  styleUrls: ['./article-render.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonContent],
})
export class ArticleRenderComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('renderElement') renderElement: ElementRef<HTMLDivElement>;

  @Input() html: Observable<Article>;
  article: SafeHtml;

  private searchText$: Observable<string> = this.store.select(selectSearchText);
  private fragment$: Observable<string> = this.store.select(selectFragment);
  private restoreProgress$: Observable<boolean> = this.store.select(selectRestoreProgress);
  private navigationState$: Observable<NavigationState> = this.store.select(selectNavigationState);

  private articleKey: string;
  private fragment: string;
  private isSearch: boolean;
  private isProgress: boolean;
  private isInternalLink: boolean;
  private progressState: Record<string, number>;

  destroyRef = inject(DestroyRef);

  constructor(private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef, private store: Store) {
  }

  saveReadProgress({ offsetHeight, scrollTop, scrollHeight }): void {
    const articleProgress = ((scrollTop / (scrollHeight - offsetHeight)) * 100).toFixed(4);
    this.store.dispatch(setArticleProgressStateAction({ key: this.articleKey, value: articleProgress }));
  }

  progressScroll(): void {
    this.restoreProgress$.pipe(first()).subscribe((restoreProgress) => {
      if (this.isProgress && restoreProgress) {
        void this.content.getScrollElement().then((element) => {
          const { scrollHeight, offsetHeight } = element;
          void this.content.scrollToPoint(0, ((scrollHeight - offsetHeight) * this.progressState[this.articleKey]) / 100, 0).then(() => {
            this.store.dispatch(returnDefaultNavigationStateAction());
          });
        });
      } else {
        this.store.dispatch(returnDefaultNavigationStateAction());
      }
    });
  }

  ngOnInit(): void {
    this.navigationState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.isSearch = state.isSearch;
      this.isProgress = state.isProgress;
      this.isInternalLink = state.isInternalLink;
    });

    this.html.pipe(withLatestFrom(this.searchText$), takeUntilDestroyed(this.destroyRef)).subscribe(([html, text]) => {
      this.article = this.sanitizer.bypassSecurityTrustHtml(html.value);
      this.articleKey = html.key;
      this.cdRef.detectChanges();
      this.scrollToText(text);
    });

    this.fragment$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        this.fragment = fragment;
      }
    });

    this.store.dispatch(increaseOpenArticleCountAction());
  }

  private scrollToText(text: string): void {
    if (text && this.isSearch) {
      const instance: Mark = new Mark(this.renderElement.nativeElement);
      instance.mark(text, { accuracy: 'complementary' });
      const markedElements = document.getElementsByTagName('mark');
      if (markedElements.length) {
        setTimeout(() => markedElements[0].scrollIntoView(), 0);
      }
    }

    if (this.fragment && this.isInternalLink) {
      const element = document.getElementById(this.fragment);
      if (element) {
        const offset = element.offsetTop;
        void this.content.scrollToPoint(0, offset, 300).then(() => {
          this.store.dispatch(returnDefaultNavigationStateAction());
        });
      }
    }

    if (this.articleKey) {
      this.progressScroll();
    }
  }
}
