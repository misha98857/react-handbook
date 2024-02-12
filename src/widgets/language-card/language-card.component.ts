import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IonCard, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './language-card.component.html',
  styleUrls: ['./language-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardTitle, NgOptimizedImage],
})
export class LanguageCardComponent {
  @Input() message: string;
  @Input() imagePath: string;
  @Input() disabled: boolean;
  @Input() language: string;
  @Input() selected: boolean;
  @Output() changeLanguage: EventEmitter<string> = new EventEmitter<string>();

  setLanguage() {
    this.changeLanguage.emit(this.language);
  }
}
