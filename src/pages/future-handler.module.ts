import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FutureHandlerComponent } from '../widgets/components/future-handler/future-handler.component';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonList, IonItem } from "@ionic/angular/standalone";

@NgModule({
    declarations: [FutureHandlerComponent],
    imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonList, IonItem],
})
export class FutureHandlerModule {
}
