import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-future-handler',
  templateUrl: './future-handler.component.html',
  styleUrls: ['./future-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonList, IonItem],
})
export class FutureHandlerComponent {}
