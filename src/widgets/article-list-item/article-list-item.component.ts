import { Component, input, output } from '@angular/core';
import { Article } from '../../entities/articles/models/articles';
import { RouterLink } from '@angular/router';

import { IonBadge, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-article-list-item',
  imports: [IonLabel, IonItem, IonBadge, RouterLink],
  templateUrl: './article-list-item.component.html',
  styleUrl: './article-list-item.component.scss',
})
export class ArticleListItemComponent {
  readonly articles = input<Article[]>([]);
  readonly showProgress = input<boolean>(true);
  readonly readProgress = input<Record<string, number>>(undefined);

  readonly openArticle = output<void>();

  onOpenArticle(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.openArticle.emit();
  }
}
