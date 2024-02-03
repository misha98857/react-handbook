import { Routes } from '@angular/router';
import {
  ReactArticlesComponent,
} from '../../pages/react-articles/react-articles.component';
import { ReactArticleComponent } from '../../pages/react-article/react-article.component';

export const routes: Routes = [
  { path: '', redirectTo: 'react', pathMatch: 'full' },
  {
    path: 'react',
    children: [
      {
        path: '',
        component: ReactArticlesComponent,
        pathMatch: 'full',
      },
      {
        path: ':name',
        component: ReactArticleComponent,
      },
    ],
  },
  {
    path: 'languages',
    loadComponent: () => import('../../pages/language-menu/languages-menu.component').then(m => m.LanguagesMenuComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('../../pages/react-search/react-search.component').then(m => m.ReactSearchComponent),
    pathMatch: 'full',
  },
  {
    path: 'error',
    loadComponent: () => import('../../pages/future-handler/future-handler.component').then(m => m.FutureHandlerComponent),
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];
