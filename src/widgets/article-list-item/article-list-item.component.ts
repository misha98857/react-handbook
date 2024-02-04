import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../entities/articles/models/articles';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { IonBadge, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-article-list-item',
  standalone: true,
  imports: [IonLabel, IonItem, IonBadge, RouterLink, NgSwitch, NgIf, NgSwitchCase, NgSwitchDefault, NgForOf],
  templateUrl: './article-list-item.component.html',
  styleUrl: './article-list-item.component.scss',
})
export class ArticleListItemComponent {
  @Input() articles: Article[] = [];
  @Input() showProgress: boolean = true;
  @Input() readProgress: Record<string, number>;

  @Output() openArticle: EventEmitter<void> = new EventEmitter<void>();

  onOpenArticle(): void {
    this.openArticle.emit();
  }
}
