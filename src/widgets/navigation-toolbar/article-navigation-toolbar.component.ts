import { Component, input } from '@angular/core';
import { IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { Article } from '../../entities/articles/models/articles';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-navigation-toolbar',
  imports: [IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, RouterLink],
  templateUrl: './article-navigation-toolbar.component.html',
  styleUrl: './article-navigation-toolbar.component.scss',
})
export class ArticleNavigationToolbarComponent {
  readonly article = input<Article>(undefined);
  readonly showProgress = input<boolean>(undefined);
  readonly readProgress = input<Record<string, number>>(undefined);
}
