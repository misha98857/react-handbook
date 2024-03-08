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
import { NavigationState } from '../../store/state/navigation.state';
import { selectNavigationState } from '../../store/selectors/navigation.selectors';
import { saveArticlesProgressStateAction, setArticleProgressStateAction } from '../../store/actions/progress.actions';
import { returnDefaultNavigationStateAction } from '../../store/actions/navigation.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectReadProgressState } from '../../store/selectors/progress.selectors';
import { ReadProgressState } from '../../store/state/read-progress.state';
import { SanitizeHtmlPipe } from '../../shared/articles/pipes/sanitaze.pipe';
import { ArticlesStore } from '../../store/signal-store/articles.store';
import { SettingsStore } from '../../store/signal-store/settings.store';

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

  readonly destroyRef = inject(DestroyRef);
  readonly articlesStore = inject(ArticlesStore);
  readonly settingsStore = inject(SettingsStore);

  private navigationState$: Observable<NavigationState> = this.store.select(selectNavigationState);
  private readProgressState$: Observable<ReadProgressState> = this.store.select(selectReadProgressState);

  constructor(private store: Store) {}

  saveReadProgress({ offsetHeight, scrollTop, scrollHeight }): void {
    const articleProgress = ((scrollTop / (scrollHeight - offsetHeight)) * 100).toFixed(4);
    this.store.dispatch(setArticleProgressStateAction({ key: this.html.key, value: articleProgress }));
  }

  scrollToReadProgress(): void {
    combineLatest([this.content.getScrollElement(), this.navigationState$, this.readProgressState$])
      .pipe(
        first(),
        filter(([_, navigationState]) => this.settingsStore.restoreArticleProgress() && navigationState.isProgress),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([{ scrollHeight, offsetHeight }, __, progressState]) => {
        this.content
          .scrollToPoint(0, ((scrollHeight - offsetHeight) * progressState[this.html.key]) / 100, 0)
          .then(() => {
            this.store.dispatch(returnDefaultNavigationStateAction());
          });
      });
  }

  ngAfterViewInit(): void {
    combineLatest([this.navigationState$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([navigationState]) => {
        this.scrollToSearchedText(this.articlesStore.searchText(), navigationState);
        this.scrollToFragment(this.articlesStore.currentFragment(), navigationState);
        this.scrollToReadProgress();
      });

    this.readProgressState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(progressState => {
      this.store.dispatch(saveArticlesProgressStateAction({ progressState }));
    });
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
      this.content.scrollToPoint(0, element.offsetTop, 300).then(() => {
        this.store.dispatch(returnDefaultNavigationStateAction());
      });
    }
  }
}
