import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonBadge,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSearchbar,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ArticleListItemComponent } from '../../widgets/article-list-item/article-list-item.component';
import { GithubStarComponent } from '../../widgets/github-star/github-star.component';
import { ArticlesStore } from '../../store/articles.store';
import { SettingsStore } from '../../store/settings.store';
import { ReadProgressStore } from '../../store/read-progress.store';
import { NavigationStore } from '../../store/navigation.store';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonSearchbar,
    IonContent,
    IonAccordionGroup,
    NgFor,
    IonAccordion,
    IonItem,
    IonLabel,
    IonList,
    RouterLink,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    IonBadge,
    NgSwitchDefault,
    AsyncPipe,
    TranslateModule,
    ArticleListItemComponent,
    GithubStarComponent,
  ],
})
export class SearchComponent {
  readonly articlesStore = inject(ArticlesStore);
  readonly settingsStore = inject(SettingsStore);
  readonly readProgressStore = inject(ReadProgressStore);
  readonly navigationStore = inject(NavigationStore);

  searchText({ detail: { value } }: { detail: { value: string } }): void {
    this.articlesStore.updateSearchText(value);
  }

  openArticleWithSearch(): void {
    this.navigationStore.updateNavigationState({ isSearch: true });
  }
}
