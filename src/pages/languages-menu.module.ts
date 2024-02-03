import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LanguageCardComponent } from '../widgets/components/languages-menu/language-card/language-card.component';
import { LanguagesMenuComponent } from '../widgets/components/languages-menu/languages-menu.component';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardTitle } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild([
            {
                path: '',
                component: LanguagesMenuComponent,
            }
        ]),
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonTitle,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonCard,
        IonCardContent,
        IonCardTitle,
        LanguagesMenuComponent, LanguageCardComponent
    ],
    exports: [LanguagesMenuComponent],
})
export class LanguagesMenuModule {
}
