import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactSearchComponent } from '../widgets/components/react-search/react-search.component';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonMenuButton, IonSearchbar, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonBadge } from "@ionic/angular/standalone";

@NgModule({
    declarations: [ReactSearchComponent],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReactSearchComponent,
            },
        ]),
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonMenuButton,
        IonSearchbar,
        IonContent,
        IonAccordionGroup,
        IonAccordion,
        IonItem,
        IonLabel,
        IonList,
        IonBadge
    ],
})
export class SearchModule {
}
