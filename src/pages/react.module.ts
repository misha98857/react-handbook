import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactArticlesComponent } from '../widgets/components/react-articles/react-articles/react-articles.component';
import { ReactArticleComponent } from '../widgets/components/react-articles/react-article/react-article.component';
import {
    ReactHtmlArticleComponent,
} from '../widgets/components/react-articles/react-html-article/react-html-article.component';
import { FutureHandlerComponent } from '../widgets/components/future-handler/future-handler.component';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonMenuButton, IonTitle, IonContent, IonFooter, IonTabs, IonTabBar, IonTabButton, IonBadge, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonList } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReactArticlesComponent,
            },
            {
                path: ':name',
                component: ReactArticleComponent,
            },
            {
                path: '**',
                component: FutureHandlerComponent,
            },
        ]),
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonButton,
        IonIcon,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonFooter,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonBadge,
        IonLabel,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonBackButton,
        IonButton,
        IonIcon,
        IonMenuButton,
        IonTitle,
        IonContent,
        IonAccordionGroup,
        IonAccordion,
        IonItem,
        IonLabel,
        IonList,
        IonBadge,
        IonContent,
        ReactArticlesComponent, ReactArticleComponent, ReactHtmlArticleComponent
    ],
})
export class ReactModule {
}
