import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Input,
  Signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, filter } from 'rxjs';
import { Article } from '../../entities/articles/models/articles';
import { IonContent } from '@ionic/angular/standalone';
import * as Mark from 'mark.js';
import { first } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SanitizeHtmlPipe } from '../../shared/articles/pipes/sanitaze.pipe';
import { ArticlesStore } from '../../store/signal-store/articles.store';
import { SettingsStore } from '../../store/signal-store/settings.store';
import { ReadProgressStore } from '../../store/signal-store/read-progress.store';
import { initialNavigationState, NavigationState, NavigationStore } from 'src/store/signal-store/navigationStore';

@Component({
  selector: 'app-article-render',
  templateUrl: './article-render.component.html',
  styleUrls: ['./article-render.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonContent, SanitizeHtmlPipe],
})
export class ArticleRenderComponent {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('renderElement') renderElement: ElementRef<HTMLDivElement>;

  @Input() html: Article;

  readonly destroyRef = inject(DestroyRef);
  readonly articlesStore = inject(ArticlesStore);
  readonly settingsStore = inject(SettingsStore);
  readonly readProgressStore = inject(ReadProgressStore);
  readonly navigationStore = inject(NavigationStore);

  constructor() {
    effect(() => {
      const navigationState = {
        isProgress: this.navigationStore.isProgress(),
        isInternalLink: this.navigationStore.isInternalLink(),
        isSearch: this.navigationStore.isSearch(),
      };

      this.scrollToSearchedText(this.articlesStore.searchText(), navigationState);
      this.scrollToFragment(this.articlesStore.currentFragment(), navigationState);
      this.scrollToReadProgress();
    });
  }

  saveReadProgress({ offsetHeight, scrollTop, scrollHeight }): void {
    const articleProgress = ((scrollTop / (scrollHeight - offsetHeight)) * 100).toFixed(4);
    console.log(articleProgress);
    this.readProgressStore.updateReadProgress({ [this.html.key]: +articleProgress });
  }

  scrollToReadProgress(): void {
    combineLatest([this.content.getScrollElement()])
      .pipe(
        first(),
        filter(([_]) => this.settingsStore.restoreArticleProgress() && this.navigationStore.isProgress()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([{ scrollHeight, offsetHeight }]) => {
        const readArticleProgress = this.readProgressStore[this.html.key] as Signal<number>;

        if (!readArticleProgress) {
          return;
        }

        console.log('readArticleProgress', readArticleProgress());

        void this.content
          .scrollToPoint(0, ((scrollHeight - offsetHeight) * readArticleProgress()) / 100, 0)
          .then(() => {
            this.navigationStore.updateNavigationState(initialNavigationState);
          });
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
      this.navigationStore.updateNavigationState(initialNavigationState);
    }
  }

  private scrollToFragment(fragment: string, { isInternalLink }: NavigationState): void {
    if (!fragment || !isInternalLink) {
      return;
    }

    const element: HTMLElement = this.renderElement.nativeElement.querySelector(`#${fragment}`);
    if (element) {
      this.content.scrollToPoint(0, element.offsetTop, 300).then(() => {
        this.navigationStore.updateNavigationState(initialNavigationState);
      });
    }
  }
}
