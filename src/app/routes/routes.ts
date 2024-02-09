import { Routes } from '@angular/router';
import { ArticlesComponent } from '../../pages/articles/articles.component';
import { ArticleComponent } from '../../pages/article/article.component';
import { LanguagesMenuComponent } from '../../pages/language-menu/languages-menu.component';
import { SearchComponent } from '../../pages/search/search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'react', pathMatch: 'full' },
  {
    path: 'react',
    children: [
      {
        path: '',
        component: ArticlesComponent,
        pathMatch: 'full',
      },
      {
        path: ':name',
        component: ArticleComponent,
      },
    ],
  },
  {
    path: 'languages',
    component: LanguagesMenuComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
    pathMatch: 'full',
  },
  {
    path: 'error',
    loadComponent: () =>
      import('../../pages/future-handler/future-handler.component').then(m => m.FutureHandlerComponent),
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];
