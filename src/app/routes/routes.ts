import { Routes } from '@angular/router';
import { FutureHandlerComponent } from '../../widgets/components/future-handler/future-handler.component';

export const routes: Routes = [
  { path: '', redirectTo: 'react', pathMatch: 'full' },
  { path: 'react', loadChildren: () => import('../../pages/react.module').then(m => m.ReactModule) },
  {
    path: 'languages',
    loadComponent: () => import('../../widgets/components/languages-menu/languages-menu.component').then(m => m.LanguagesMenuComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('../../widgets/components/react-search/react-search.component').then(m => m.ReactSearchComponent),
    pathMatch: 'full',
  },
  {
    path: 'error',
    loadComponent: () => import('../../widgets/components/future-handler/future-handler.component').then(m => m.FutureHandlerComponent),
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];
