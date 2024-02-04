import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleGroup } from '../../entities/articles/models/articles';
import { Store } from '@ngrx/store';
import { selectSearchedArticles } from '../../store/selectors/articles.selectors';
import { selectReadProgressState } from '../../store/selectors/progress.selectors';
import { selectShowProgress } from '../../store/selectors/settings.selectors';
import { searchArticlesAction } from '../../store/actions/articles.actions';
import { openWithSearchAction } from '../../store/actions/navigation.actions';
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
  ],
})
export class SearchComponent {
  articleGroups$: Observable<Array<ArticleGroup>> = this.store.select(selectSearchedArticles);
  progress: Observable<Record<string, number>> = this.store.select(selectReadProgressState);
  showProgress: Observable<boolean> = this.store.select(selectShowProgress);

  constructor(private store: Store) {}

  searchText({ detail: { value } }): void {
    this.store.dispatch(searchArticlesAction({ text: value }));
  }

  openArticleWithSearch(): void {
    this.store.dispatch(openWithSearchAction());
  }
}
