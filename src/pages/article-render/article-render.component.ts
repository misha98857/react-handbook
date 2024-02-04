import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
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
export class ArticleRenderComponent implements OnInit, AfterViewChecked {
  @ViewChild(IonContent) content: IonContent;
  @Input() html: Observable<Article>;
  article: SafeHtml;

  private articleKey: string;
  private text$: Observable<string> = this.store.select(selectSearchText);
  private fragment$: Observable<string> = this.store.select(selectFragment);
  private restoreProgress: Observable<boolean> = this.store.select(selectRestoreProgress);
  private fragment: string;
  private text: string;
  private lock: boolean;
  private navigationState: Observable<NavigationState> = this.store.select(selectNavigationState);
  private isSearch: boolean;
  private isProgress: boolean;
  private isInternalLink: boolean;
  private progressState: Record<string, number>;

  constructor(private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef, private store: Store) {
  }

  saveReadProgress(scrollElement: Element): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { offsetHeight, scrollTop, scrollHeight } = scrollElement;
    const articleProgress = ((scrollTop / (scrollHeight - offsetHeight)) * 100).toFixed(4);
    this.store.dispatch(setArticleProgressStateAction({ key: this.articleKey, value: articleProgress }));
  }

  progressScroll(): void {
    this.restoreProgress.pipe(first()).subscribe((restoreProgress) => {
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
    this.navigationState.pipe(takeUntilDestroyed()).subscribe((state) => {
      this.isSearch = state.isSearch;
      this.isProgress = state.isProgress;
      this.isInternalLink = state.isInternalLink;
    });

    this.html.pipe(takeUntilDestroyed()).subscribe((html) => {
      this.article = this.sanitizer.bypassSecurityTrustHtml(html.value);
      this.articleKey = html.key;
      this.cdRef.markForCheck();
    });


    this.text$.pipe(takeUntilDestroyed()).subscribe((text) => {
      if (text) {
        this.lock = false;
        this.text = text;
      }
    });

    this.fragment$.pipe(takeUntilDestroyed()).subscribe((fragment) => {
      if (fragment) {
        this.lock = false;
        this.fragment = fragment;
      }
    });

    this.store.dispatch(increaseOpenArticleCountAction());
  }

  ngAfterViewChecked(): void {
    if (this.text && this.isSearch) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const instance: Mark = new Mark(this.content.el);
      instance.mark(this.text);
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
