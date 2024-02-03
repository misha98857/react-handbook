import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../widgets/components/app-menu/menu.component';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle } from "@ionic/angular/standalone";

@NgModule({
    declarations: [MenuComponent],
    imports: [CommonModule, TranslateModule, RouterModule, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle],
    exports: [MenuComponent],
})
export class AppMenuModule {
}
