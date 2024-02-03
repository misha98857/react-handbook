import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { IonBadge, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { Article } from '../../entities/articles/models/article';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-navigation-toolbar',
  standalone: true,
  imports: [
    AsyncPipe,
    IonBadge,
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
    IonTabs,
    NgIf,
    NgSwitchCase,
    RouterLink,
    NgSwitch,
    NgSwitchDefault,
  ],
  templateUrl: './article-navigation-toolbar.component.html',
  styleUrl: './article-navigation-toolbar.component.scss',
})
export class ArticleNavigationToolbarComponent {
  @Input() article: Article;
  @Input() showProgress: boolean;
  @Input() readProgress: Record<string, number>;
}
