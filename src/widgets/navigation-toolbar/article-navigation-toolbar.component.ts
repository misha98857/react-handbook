import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { Article } from '../../entities/articles/models/articles';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-navigation-toolbar',
  imports: [AsyncPipe, IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, RouterLink],
  templateUrl: './article-navigation-toolbar.component.html',
  styleUrl: './article-navigation-toolbar.component.scss',
})
export class ArticleNavigationToolbarComponent {
  @Input() article: Article;
  @Input() showProgress: boolean;
  @Input() readProgress: Record<string, number>;
}
