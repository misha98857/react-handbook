import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactArticlesComponent } from '../components/react-articles/react-articles/react-articles.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactArticleComponent } from '../components/react-articles/react-article/react-article.component';
import { ReactHtmlArticleComponent } from '../components/react-articles/react-html-article/react-html-article.component';
import { FutureHandlerComponent } from '../components/future-handler/future-handler.component';
import { TranslateModule } from '@ngx-translate/core';

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
  ]
})
export class ReactModule {}
