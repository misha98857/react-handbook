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
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-future-handler',
  templateUrl: './future-handler.component.html',
  styleUrls: ['./future-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonGrid,
    IonList,
    IonItem,
    TranslateModule,
  ],
})
export class FutureHandlerComponent {}
