import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  ViewEncapsulation,
  input,
  viewChild,
} from '@angular/core';
import { filter, from, switchMap } from 'rxjs';
import { Article } from '../../entities/articles/models/articles';
import { IonContent } from '@ionic/angular/standalone';
import Mark from 'mark.js';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SanitizeHtmlPipe } from '../../shared/articles/pipes/sanitaze.pipe';
import { ArticlesStore } from '../../store/articles.store';
import { SettingsStore } from '../../store/settings.store';
import { ReadProgressStore } from '../../store/read-progress.store';
import { initialNavigationState, NavigationState, NavigationStore } from 'src/store/navigation.store';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-article-render',
  templateUrl: './article-render.component.html',
  styleUrls: ['./article-render.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, SanitizeHtmlPipe],
})
export class ArticleRenderComponent {
  readonly content = viewChild(IonContent);
  readonly renderElement = viewChild<ElementRef<HTMLDivElement>>('renderElement');

  readonly html = input<Article>(undefined);

  readonly destroyRef = inject(DestroyRef);
  readonly articlesStore = inject(ArticlesStore);
  readonly settingsStore = inject(SettingsStore);
  readonly readProgressStore = inject(ReadProgressStore);
  readonly navigationStore = inject(NavigationStore);
  readonly router = inject(Router);
  readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      const navigationState = {
        isProgress: this.navigationStore.isProgress(),
        isInternalLink: this.navigationStore.isInternalLink(),
        isSearch: this.navigationStore.isSearch(),
      };

      this.scrollToSearchedText(this.articlesStore.searchText(), navigationState);
      this.scrollToFragment(this.articlesStore.fragment(), navigationState);
      this.scrollToReadProgress();
    });

    // Translate nodes carrying `data-i18n` once the article HTML has been
    // materialised into the DOM. This covers labels emitted by the content
    // pipeline (e.g. "Interactive example", "Show solution") that live inside
    // trusted innerHTML and therefore bypass Angular's binding machinery.
    effect(() => {
      const article = this.html();
      if (!article) return;
      queueMicrotask(() => this.translateEmbeddedLabels());
    });

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.translateEmbeddedLabels();
    });
  }

  private translateEmbeddedLabels(): void {
    const host = this.renderElement()?.nativeElement;
    if (!host) return;
    const nodes = host.querySelectorAll<HTMLElement>('[data-i18n]');
    nodes.forEach(node => {
      const key = node.dataset['i18n'];
      if (!key) return;
      const value = this.translate.instant(key) as string;
      if (value && value !== key) {
        node.textContent = value;
      }
    });
  }

  saveReadProgress({ offsetHeight, scrollTop, scrollHeight }): void {
    const articleProgress = ((scrollTop / (scrollHeight - offsetHeight)) * 100).toFixed(4);
    this.readProgressStore.updateReadProgress({ [this.html().key]: +articleProgress });
  }

  scrollToReadProgress(): void {
    from(this.content().getScrollElement())
      .pipe(
        filter(() => this.settingsStore.restoreArticleProgress() && this.navigationStore.isProgress()),
        switchMap(({ scrollHeight, offsetHeight }) => {
          const readArticleProgress = this.readProgressStore.readProgressState()[this.html().key] ?? 0;
          return this.content().scrollToPoint(0, ((scrollHeight - offsetHeight) * readArticleProgress) / 100, 0);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.navigationStore.updateNavigationState(initialNavigationState);
      });
  }

  private scrollToSearchedText(text: string, { isSearch }: NavigationState): void {
    if (!text || !isSearch) {
      return;
    }

    const instance: Mark = new Mark(this.renderElement().nativeElement);
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

    const element: HTMLElement = this.renderElement().nativeElement.querySelector(`#${fragment}`);

    if (element) {
      setTimeout(() => void this.content().scrollToPoint(0, element.offsetTop, 300));
      this.navigationStore.updateNavigationState(initialNavigationState);
    }
  }
}
