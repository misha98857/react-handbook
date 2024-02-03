import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactArticlesComponent } from '../widgets/components/react-articles/react-articles/react-articles.component';
import { ReactArticleComponent } from '../widgets/components/react-articles/react-article/react-article.component';
import {
  ReactHtmlArticleComponent,
} from '../widgets/components/react-articles/react-html-article/react-html-article.component';
import { FutureHandlerComponent } from '../widgets/components/future-handler/future-handler.component';

@NgModule({
  declarations: [ReactArticlesComponent, ReactArticleComponent, ReactHtmlArticleComponent],
  imports: [
    CommonModule,
    IonicModule,
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
  ],
})
export class ReactModule {
}
