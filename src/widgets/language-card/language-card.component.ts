import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonCard, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './language-card.component.html',
  styleUrls: ['./language-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonCard, IonCardContent, IonCardTitle, NgOptimizedImage],
})
export class LanguageCardComponent {
  readonly message = input<string>(undefined);
  readonly imagePath = input<string>(undefined);
  readonly disabled = input<boolean>(undefined);
  readonly language = input<string>(undefined);
  readonly selected = input<boolean>(undefined);
  readonly changeLanguage = output<string>();

  setLanguage() {
    this.changeLanguage.emit(this.language());
  }
}
