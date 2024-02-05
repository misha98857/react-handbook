import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, filter, Observable } from 'rxjs';
import { Article } from '../../entities/articles/models/articles';
import { Store } from '@ngrx/store';
import { IonContent } from '@ionic/angular/standalone';
import * as Mark from 'mark.js';
import { first } from 'rxjs/operators';
import { selectFragment, selectSearchText } from '../../store/selectors/articles.selectors';
import { selectRestoreProgress } from '../../store/selectors/settings.selectors';
import { NavigationState } from '../../store/state/navigation.state';
import { selectNavigationState } from '../../store/selectors/navigation.selectors';
import { saveArticlesProgressStateAction, setArticleProgressStateAction } from '../../store/actions/progress.actions';
import {
  increaseOpenArticleCountAction,
  returnDefaultNavigationStateAction,
} from '../../store/actions/navigation.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectReadProgressState } from '../../store/selectors/progress.selectors';
import { ReadProgressState } from '../../store/state/read-progress.state';
import { SanitizeHtmlPipe } from '../../shared/articles/pipes/sanitaze.pipe';

@Component({
  selector: 'app-article-render',
  templateUrl: './article-render.component.html',
  styleUrls: ['./article-render.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonContent, SanitizeHtmlPipe],
})
export class ArticleRenderComponent implements AfterViewInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('renderElement') renderElement: ElementRef<HTMLDivElement>;

  @Input() html: Article;

  destroyRef = inject(DestroyRef);

  private searchText$: Observable<string> = this.store.select(selectSearchText);
  private fragment$: Observable<string> = this.store.select(selectFragment);
  private restoreProgress$: Observable<boolean> = this.store.select(selectRestoreProgress);
  private navigationState$: Observable<NavigationState> = this.store.select(selectNavigationState);
  private readProgressState$: Observable<ReadProgressState> = this.store.select(selectReadProgressState);

  constructor(private store: Store) {}

  saveReadProgress({ offsetHeight, scrollTop, scrollHeight }): void {
    const articleProgress = ((scrollTop / (scrollHeight - offsetHeight)) * 100).toFixed(4);
    this.store.dispatch(setArticleProgressStateAction({ key: this.html.key, value: articleProgress }));
  }

  scrollToReadProgress(): void {
    combineLatest([
      this.restoreProgress$,
      this.content.getScrollElement(),
      this.navigationState$,
      this.readProgressState$,
    ])
      .pipe(
        first(),
        filter(([restoreProgress, _, navigationState]) => restoreProgress && navigationState.isProgress),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([_, { scrollHeight, offsetHeight }, __, progressState]) => {
        // TODO: when trigger this action this.html empty. Need to fix it
        this.content
          .scrollToPoint(0, ((scrollHeight - offsetHeight) * progressState[this.html.key]) / 100, 0)
          .then(() => {
            this.store.dispatch(returnDefaultNavigationStateAction());
          });
      });
  }

  ngAfterViewInit(): void {
    combineLatest([this.navigationState$, this.searchText$, this.fragment$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([navigationState, searchText, fragment]) => {
        this.scrollToSearchedText(searchText, navigationState);
        this.scrollToFragment(fragment, navigationState);
        this.scrollToReadProgress();
      });

    this.readProgressState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(progressState => {
      this.store.dispatch(saveArticlesProgressStateAction({ progressState }));
    });

    this.store.dispatch(increaseOpenArticleCountAction());
  }

  private scrollToSearchedText(text: string, { isSearch }: NavigationState): void {
    if (!text || !isSearch) {
      return;
    }

    const instance: Mark = new Mark(this.renderElement.nativeElement);
    instance.mark(text, { accuracy: 'complementary' });
    const markedElements = document.getElementsByTagName('mark');

    if (markedElements.length) {
      setTimeout(() => markedElements?.[0].scrollIntoView());
      this.store.dispatch(returnDefaultNavigationStateAction());
    }
  }

  private scrollToFragment(fragment: string, { isInternalLink }: NavigationState): void {
    if (!fragment || !isInternalLink) {
      return;
    }

    const element: HTMLElement = this.renderElement.nativeElement.querySelector(`#${fragment}`);
    if (element) {
      this.content.scrollToPoint(0, element.offsetTop).then(() => {
        this.store.dispatch(returnDefaultNavigationStateAction());
      });
    }
  }
}
