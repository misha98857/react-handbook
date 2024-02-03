import { Routes } from '@angular/router';
import { FutureHandlerComponent } from '../../widgets/components/future-handler/future-handler.component';

export const routes: Routes = [
  { path: '', redirectTo: 'react', pathMatch: 'full' },
  { path: 'react', loadChildren: () => import('../../pages/react.module').then(m => m.ReactModule) },
  {
    path: 'languages',
    loadChildren: () => import('../../pages/languages-menu.module').then(m => m.LanguagesMenuModule),
  },
  {
    path: 'search',
    loadChildren: () => import('../../pages/search.module').then((m) => m.SearchModule),
    pathMatch: 'full',
  },
  { path: 'error', component: FutureHandlerComponent, pathMatch: 'full' },
  { path: '**', redirectTo: 'error', pathMatch: 'full' },
];
